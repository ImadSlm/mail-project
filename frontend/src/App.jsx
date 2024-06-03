/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import loader from "./assets/loader.svg";
import MailForm from "./components/MailForm";

export default function App() {
    const [recipients, setRecipients] = useState(["saleem@et.esiea.fr"]);
    const [subject, setSubject] = useState("sujet test");
    const [message, setMessage] = useState("msg test");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [mailData, setMailData] = useState(null);
    const [showEvent, setShowEvent] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [emails, setEmails] = useState([]);  // Added state to hold fetched emails
    const [showRead, setShowRead] = useState(true);
    const [sortBy, setSortBy] = useState("date");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("http://localhost:8080/send_email", {
                recipients,
                subject,
                message,
            });
            console.log(res);
            setResponse(res.data);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setError("Une erreur interne du serveur est survenue.");
            } else {
                setError(`Erreur : ${error.message}`);
            }
        }
    };

    const getMail = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch("http://localhost:8080/get_mail");
            const data = await response.text();
            console.log(data);
            setMailData(data);
        } catch (error) {
            console.error("Failed to fetch mail data", error);
        }
    };

    useEffect(() => {
        const fetchEmailAddress = async () => {
            try {
                const res = await axios.get("http://localhost:8080/get_email_address");
                setEmailAddress(res.data);
            } catch (error) {
                console.error("Failed to fetch email address", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmailAddress();
    }, []);

    useEffect(() => {
        if (response) {
            setShowEvent(true);
            setTimeout(() => {
                setShowEvent(false);
            }, 5000);
        }
    }, [response]);

    useEffect(() => {
        const fetchEmails = async () => {
            const response = await axios.get("http://127.0.0.1:8080/get_emails");  // Added to fetch emails from backend
            setEmails(response.data);  // Set fetched emails to state
        };
        fetchEmails();
    }, []);

    const sortedEmails = [...emails].sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "recipient") {
            return a.recipients[0].localeCompare(b.recipients[0]);
        }
        return 0;
    });

    const filteredEmails = showRead
        ? sortedEmails
        : sortedEmails.filter((email) => !email.is_read);

    return (
        <div className="bg-slate-800 flex justify-center h-screen">
            <div className="ml-4 text-center">
                <h1 className="text-4xl font-semibold text-center border-b-2 pb-2 text-white">
                    Client Mail
                </h1>

                <p className="text-slate-400 py-5 ml-4 ">
                    {loading || !emailAddress ? (
                        <img src={loader} className="mx-auto" alt="Loading..." />
                    ) : (
                        `Connecté en tant que ${emailAddress}`
                    )}
                </p>

                <MailForm
                    recipients={recipients}
                    setRecipients={setRecipients}
                    subject={subject}
                    setSubject={setSubject}
                    message={message}
                    setMessage={setMessage}
                    handleSubmit={handleSubmit}
                />

                {/* <button
                    onClick={getMail}
                    className="border-rounded border-slate-400 text-slate-200 bg-green-700 mx-6 hover:bg-green-800 my-6 px-2 py-0"
                >
                    Récuperer le mail
                </button> */}

                {mailData && (
                    <div className="mt-4 text-white">
                        <h6 className="text-2xl">Mail reçu:</h6>
                        <p>{mailData}</p>
                    </div>
                )}

                {showEvent && <p className="text-xl text-white">{response}</p>}

                {error && (
                    <p className="text-red-500 text-center text-xl font-medium">
                        {error}
                    </p>
                )}
            </div>

            <div className="flex flex-col text-slate-300">
                <h1 className="flex flex-col">Boite de réception</h1>
                <div>
                    {/* Option to show or hide read emails */}
                    <label>
                        <input
                            type="checkbox"
                            checked={showRead}
                            onChange={() => setShowRead(!showRead)}
                        />
                        Montrer les emails lus
                    </label>
                    {/* Option to sort emails by date or recipient */}
                    <select
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                    >
                        <option value="date">Trier par date</option>
                        <option value="recipient">Trier par destinataire</option>
                    </select>
                </div>
                <ul>
                    {/* Display filtered and sorted emails */}
                    {filteredEmails.map((email) => (
                        <li
                            key={email.id}
                            style={{
                                fontWeight: email.is_read ? "normal" : "bold",
                            }}
                            className="border-2 border-slate-600 p-2"
                        >
                            <p>
                                <strong>De :</strong> {email.author}
                            </p>
                            <p>
                                <strong>À :</strong> {email.recipients.join(", ")}
                            </p>
                            <h2>{email.subject}</h2>
                            <p>{email.body}</p>
                            <p>
                                <strong>Date :</strong> {email.date}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className="fixed w-full border-t-2 border-slate-600 text-center text-slate-100 bottom-0 py-2">
                Mouad Moubtakir - Imad Saleem
            </footer>
        </div>
    );
}
