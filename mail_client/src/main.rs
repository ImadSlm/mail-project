use actix_web::{post, get, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::client::Tls;
use lettre::transport::smtp::client::TlsParameters;
use lettre::message::header::InReplyTo;
use dotenv::dotenv;
use std::env;
use serde::{Deserialize, Serialize};
// use std::time::SystemTime;
use native_tls::TlsConnector; // Added for TLS connection
// use imap::Session; // Added for IMAP session
use std::net::TcpStream; // Added for TCP connection
use mailparse::parse_mail; // Added for parsing email
use mailparse::MailHeaderMap;
use imap::Client;
use chrono::{DateTime, FixedOffset, Local, TimeZone};
use std::sync::Mutex;
use std::collections::HashSet;

#[macro_use]
extern crate lazy_static;


lazy_static! {
    static ref READ_EMAILS: Mutex<HashSet<u32>> = Mutex::new(HashSet::new());
}

#[derive(Deserialize)]
struct EmailRequest {
    recipients: Vec<String>,
    subject: String,
    message: String,
    in_reply_to: Option<u32>,
    cc: Vec<String>,
}

#[derive(Serialize, Deserialize)] // Add Serialize and Deserialize to Email struct
struct Email {
    id: u32,
    author: String,
    recipients: Vec<String>,
    subject: String,
    body: String,
    date: String, // Use chrono DateTime for date
    is_read: bool,
    in_reply_to: Option<u32>,
}

// Définir une fonction pour formater la date
fn format_date(date_str: &str) -> String {
    // Utiliser le fuseau horaire UTC pour analyser la date
    let utc_time = chrono::offset::Utc::now();
    let date_time: DateTime<FixedOffset> = DateTime::parse_from_rfc2822(date_str)
        .unwrap_or_else(|_| FixedOffset::east(0).from_utc_datetime(&utc_time.naive_utc())); // Utiliser le fuseau horaire UTC si le parsing échoue

    // Convertir en fuseau horaire local
    let local_time: DateTime<Local> = date_time.with_timezone(&Local);

    // Utiliser strftime pour formater la date selon le format désiré
    let formatted_date = local_time.format("%a, %d %b %Y %H:%M").to_string();

    formatted_date
}

fn extract_text_body(parsed: &mailparse::ParsedMail) -> String {
    if parsed.subparts.is_empty() {
        parsed.get_body().unwrap_or_default()
    } else {
        parsed.subparts.iter()
            .filter(|part| {
                part.get_headers().get_first_value("Content-Type")
                    .map(|content_type| content_type.starts_with("text/plain"))
                    .unwrap_or(false)
            })
            .map(|part| part.get_body().unwrap_or_default())
            .collect::<Vec<_>>()
            .join("\n")
    }
}

#[get("/get_email_address")]
async fn get_email_address() -> impl Responder {
    dotenv().ok();
    let email_address = env::var("EMAIL_ADDRESS").expect("EMAIL_ADDRESS must be set");
    HttpResponse::Ok().body(email_address)
}

#[post("/send_email")]
async fn send_email(req: web::Json<EmailRequest>) -> impl Responder {
    dotenv().ok();

    let email_address = env::var("EMAIL_ADDRESS").expect("EMAIL_ADDRESS must be set");
    let email_password = env::var("EMAIL_PASSWORD").expect("EMAIL_PASSWORD must be set");

    println!("EMAIL_ADDRESS: {:?}", email_address);
    println!("EMAIL_PASSWORD: {:?}", email_password);

    let mut email_builder = Message::builder()
        .from(email_address.parse().expect("Invalid from address"))
        .subject(&req.subject);

    for recipient in &req.recipients {
        email_builder = email_builder.to(recipient.parse().expect("Invalid to address"));
    }

    if let Some(in_reply_to) = req.in_reply_to {
        email_builder = email_builder.header(InReplyTo::from(in_reply_to.to_string()));    
    }
    
    for cc_recipient in &req.cc { // Ajout des destinataires en copie carbone (CC)
        email_builder = email_builder.cc(cc_recipient.parse().expect("Invalid CC address"));
    }
    
    let email = email_builder
        .body(req.message.clone())
        .expect("Failed to build email");

    let smtp_server = "smtp.office365.com"; //smtp-mail.outlook.com ou office365.com
    
    let tls_parameters = TlsParameters::builder(smtp_server.to_string())
        .build()
        .expect("Failed to build TLS parameters");

    let mailer = SmtpTransport::relay(smtp_server)
        .expect("Failed to build mailer")
        .credentials(Credentials::new(email_address.clone(), email_password.clone()))
        .tls(Tls::Required(tls_parameters))
        .port(587)
        .build();

    match mailer.send(&email) {
        Ok(_) => HttpResponse::Ok().body("Message envoyé avec succès !"),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Erreur lors de l'envoi du message : {:?}", e))
        }
    }
}

// Fetch emails from the inbox
async fn fetch_emails() -> Result<Vec<Email>, Box<dyn std::error::Error>> {
    dotenv().ok();
    let email_address = env::var("EMAIL_ADDRESS").expect("EMAIL_ADDRESS must be set");
    let email_password = env::var("EMAIL_PASSWORD").expect("EMAIL_PASSWORD must be set");

    // Establishing a raw TCP connection to the IMAP server
    let tcp_stream = TcpStream::connect("outlook.office365.com:993")?; // Corrected TCP connection
    // Wrapping the TCP stream with a TLS layer
    let tls_connector = TlsConnector::builder().build()?; // Corrected TLS connection
    let tls_stream = tls_connector.connect("outlook.office365.com", tcp_stream)?; // Corrected TLS connection

    // Creating an IMAP client with the TLS-wrapped stream
    let mut imap_session = Client::new(tls_stream)
        .login(&email_address, &email_password) // Corrected login usage
        .map_err(|e| e.0)?;

    imap_session.select("INBOX")?;
    let messages = imap_session.fetch("1:*", "(RFC822)")?;
    let mut emails = Vec::new();
    let mut id = 1;

    for message in messages.iter() {
        if let Some(body) = message.body() {
            let parsed = parse_mail(body)?;  // Added for parsing email
            let author: String = parsed.headers.get_first_value("From").unwrap_or_default();
            let subject = parsed.headers.get_first_value("Subject").unwrap_or_default();
            let date = parsed.headers.get_first_value("Date").unwrap_or_default();
            let formatted_date = format_date(&date); // Formatage de la date
            let body = extract_text_body(&parsed);
            // println!("body : {:?}", body);
            
            

            emails.push(Email {
                id,
                author,
                recipients: vec![email_address.clone()],
                subject,
                body,
                date : formatted_date,
                is_read: READ_EMAILS.lock().unwrap().contains(&id),
                in_reply_to: None,
            });
            id += 1;
        }
    }

    imap_session.logout()?;
    Ok(emails)
}

#[get("/get_emails")]
async fn get_emails() -> impl Responder {
    match fetch_emails().await {
        Ok(emails) => HttpResponse::Ok().json(emails),
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch emails"),
    }
}

#[post("/mark_as_read/{id}")]
async fn mark_as_read(id: web::Path<u32>) -> impl Responder {
    let id = id.into_inner();
    READ_EMAILS.lock().unwrap().insert(id);
    HttpResponse::Ok().body("Email marked as read")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // fetch_emails().await.unwrap();
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .service(send_email)
            .service(get_email_address)
            //.service(get_mail)
            .service(get_emails)
            .service(mark_as_read)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
