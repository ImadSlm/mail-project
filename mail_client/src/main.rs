
// use lettre::transport::smtp::authentication::Credentials;
// use lettre::{Message, SmtpTransport, Transport};
// use tokio;
// use dotenv::dotenv;
// use std::env;

// #[tokio::main]      //Fonction principale asynchrone
// async fn main() {
//     dotenv().ok();      //Chargement des variables d'environnement

//     let email_address = env::var("EMAIL_ADDRESS").expect("EMAIL_ADDRESS must be set");
//     let email_password = env::var("EMAIL_PASSWORD").expect("EMAIL_PASSWORD must be set");
//     let recipient = env::var("RECIPIENT").expect("RECIPIENT must be set");
//     let subject = env::var("SUBJECT").expect("SUBJECT must be set");
//     let message = env::var("MESSAGE").expect("MESSAGE must be set");

//     let email = Message::builder()
//         .from(email_address.parse().expect("Invalid from address"))
//         .to(recipient.parse().expect("Invalid to address"))
//         .subject(subject)
//         .body(message)
//         .expect("Failed to build email");

//     let smtp_server = "smtp-mail.outlook.com";         //Serveur SMTP, pour gmail : smtp.gmail.com, pour outlook : smtp.office365.com

//     let mailer = SmtpTransport::relay(smtp_server)
//         .expect("Failed to build mailer")
//         .credentials(Credentials::new(email_address, email_password))       //Entrée des identifiants
//         .port(587)      //starttls_relay utilise le port 465 sinon 587 avec relay
//         .build();

//     match mailer.send(&email) {
//         Ok(_) => println!("Message envoyé avec succès !"),
//         Err(e) => println!("Erreur lors de l'envoi du message : {:?}", e),
//     }
// }

use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
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

    let email = Message::builder()
        .from(email_address.parse().expect("Invalid from address"))
        .to(req.recipient.parse().expect("Invalid to address"))
        .subject(&req.subject)
        .body(req.message.clone())
        .expect("Failed to build email");

    let smtp_server = "smtp-mail.outlook.com";

    let mailer = SmtpTransport::relay(smtp_server)
        .expect("Failed to build mailer")
        .credentials(Credentials::new(email_address, email_password))
        .port(587)
        .build();

    match mailer.send(&email) {
        Ok(_) => HttpResponse::Ok().body("Message envoyé avec succès !"),
        Err(e) => HttpResponse::InternalServerError().body(format!("Erreur lors de l'envoi du message : {:?}", e)),
    }
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
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
