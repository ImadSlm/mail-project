use actix_web::{post,get, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::client::Tls;
use lettre::transport::smtp::client::TlsParameters;
use serde::Deserialize;
use dotenv::dotenv;
use std::env;

#[derive(Deserialize)]
struct EmailRequest {
    recipient: String,
    subject: String,
    message: String,
}

#[post("/send_email")]
async fn send_email(req: web::Json<EmailRequest>) -> impl Responder {
    dotenv().ok();

    let email_address = env::var("EMAIL_ADDRESS").expect("EMAIL_ADDRESS must be set");
    let email_password = env::var("EMAIL_PASSWORD").expect("EMAIL_PASSWORD must be set");

    println!("EMAIL_ADDRESS: {:?}", email_address);
    println!("EMAIL_PASSWORD: {:?}", email_password);

    let email = Message::builder()
        .from(email_address.parse().expect("Invalid from address"))
        .to(req.recipient.parse().expect("Invalid to address"))
        .subject(&req.subject)
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
            .service(get_mail)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
