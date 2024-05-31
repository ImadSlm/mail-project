use actix_web::{post,get, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::client::Tls;
use lettre::transport::smtp::client::TlsParameters;

use dotenv::dotenv;
use std::env;
use chrono::DateTime;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Deserialize)]
struct EmailRequest {
    recipients: Vec<String>,
    subject: String,
    message: String,
}
#[derive(Serialize, Deserialize)] // Add Serialize and Deserialize to Email struct
struct Email {
    id: u32,
    recipients: Vec<String>,
    subject: String,
    body: String,
    date: SystemTime, // Use chrono DateTime for date
    is_read: bool,
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
            println!("Erreur lors de l'envoi du message : {:?}", e);
            HttpResponse::InternalServerError().body(format!("Erreur lors de l'envoi du message : {:?}", e))
        }
    }
}

#[get("/get_mail")]
async fn get_mail() -> impl Responder {
    HttpResponse::Ok().body("Mail récupéré avec succès !")
}


// Nouvelle route pour récupérer la liste des emails
#[get("/get_emails")]
async fn get_emails() -> impl Responder {
    // Données fictives pour la démonstration
    let emails = vec![
        Email { id: 1, recipients: vec!["user@example.com".to_string()], subject: "Test Email 1".to_string(), body: "This is a test email.".to_string(), date: SystemTime::now(), is_read: false },
        Email { id: 2, recipients: vec!["user@example.com".to_string()], subject: "Test Email 2".to_string(), body: "This is another test email.".to_string(), date: SystemTime::now(), is_read: true },
    ];
    HttpResponse::Ok().json(emails)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .service(send_email)
            .service(get_email_address)
            .service(get_mail)
            .service(get_emails) // Enregistrement de la nouvelle route
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
