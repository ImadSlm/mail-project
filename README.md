# ---- MAIL-PROJECT RUST ----

### Création d'un client mail pour envoyer et recevoir du courriel.



## Sommaire

- [Fonctionnalités](#fonctionnalités)
  
- [Installations](#installations)
  
- [Lancement de l'application](#lancement-de-lapplication)
  
- [Structure du projet](#structure-du-projet)
  
- [Captures](#captures)
  


## Fonctionnalités

- Envoyer un courriel à un ou plusieurs destintaires (avec ou sans Cc)

- Consulter sa boîte de réception

- Trier les mails reçus (lu/non lu, par date ou par destinataire)
  
- Répondre a un mail



## Installations

Installer <a href="https://nodejs.org/en/download/prebuilt-installer" target="_blank"><strong>Node.js</strong></a> et <a href="https://www.rust-lang.org/tools/install" target="_blank"><strong>Rust</strong></a> si besoin

### Installation des dépendances Node
```console
cd frontend
npm install
```

### Installation des dépendances Rust
```console
cd ../backend
cargo build
```

### Créer un fichier .env dans mail-project/mail_client avec :

```console
EMAIL_ADDRESS=*adresse mail*
EMAIL_PASSWORD=*mdp*
```  
##### Adresse Outlook recommandée.  



## Lancement de l'application

#### Terminal (avec Concurrently - pour lancer le frontend et le backend simultanément):

```console
cd frontend
npm start
```

#### Terminal (sans Concurrently) :
 
 ```console
cd mail_client
cargo run
cd ../frontend
npm run dev
```



## Structure du projet

 ```console
mail-project/
│
├── mail_client/            # Rust
│   ├── src/
│   ├── Cargo.toml
│   └── ...
│
├── frontend/               # React
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── ...
│
├── captures/
├── README.md           
└── .gitignore
 ```



## Captures
##### Affichage du client :  

![alt text](https://github.com/ImadSlm/mail-project/blob/main/captures/cap1.png "Client mail")  

##### Formulaire d'envoi de mail avec l'exemple de mail reçu :  

![alt text](https://github.com/ImadSlm/mail-project/blob/main/captures/cap2.png "Formulaire de mail")  
![alt text](https://github.com/ImadSlm/mail-project/blob/main/captures/cap3.png "Exemple de mail")  

##### Mail consulté depuis le boîte de réception :  

![alt text](https://github.com/ImadSlm/mail-project/blob/main/captures/cap4.png "Mail consulté via la boîte de réception")  

#### Par : Mouad Moubtakir - Imad Saleem
