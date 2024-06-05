import { useState, useEffect } from "react";

export default function MailForm({
    handleSubmit,
    recipients : initialRecipients,
    setRecipients,
    subject : initialSubject,
    setSubject,
    message : initialMessage,
    setMessage,
    showEvent,
    response,
    error,
    loading,
    emailAddress,
    loader,
    selectedEmail
}) {

    const [recipients, setSelectedRecipients] = useState(initialRecipients);
    const [subject, setSelectedSubject] = useState(initialSubject);
    const [message, setSelectedMessage] = useState(initialMessage);

    useEffect(() => {
        if (selectedEmail) {
            setRecipients([selectedEmail.author]); // Utilisez l'auteur du mail comme destinataire par défaut
            setSubject(`Re: ${selectedEmail.subject}`); // Ajoutez "Re: " au sujet du mail original
            setMessage(`\n\nLe ${selectedEmail.date}, ${selectedEmail.author} a écrit :\n${selectedEmail.body}`); // Préremplissez le message avec le corps du mail original
        }
    }, [selectedEmail, setRecipients, setSubject, setMessage]);

    return (
        <div className="text-center sm:mr-12 mr-0">
            <h1 className="text-2xl font-semibold text-center border-b-2 pb-2 text-white">
                Envoyer un mail
            </h1>
            <p className="text-slate-400 py-5 ml-4 ">
                {loading || !emailAddress ? (
                    <img src={loader} className="mx-auto" alt="Loading..." />
                ) : (
                    `Connecté en tant que ${emailAddress}`
                )}
            </p>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="justify-center border text-slate-100 border-slate-600 border-rounded px-6 py-6">
                <div className="form-element">
                    <label className="mt-2 mb-1">Destinataire(s) :</label>
                    <input
                        className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                        type="text"
                        value={
                            Array.isArray(recipients)
                                ? recipients.join(",")
                                : ""
                        }
                        onChange={(e) =>
                            setRecipients(
                                setSelectedRecipients(e.target.value.split(",").map((email) => email.trim()))
                            )
                        }
                        placeholder="Séparer les adresses par une virgule"
                        required
                    />
                </div>
                <div className="form-element">
                    <label className="mt-2 mb-1">Objet :</label>
                    <input
                        className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(setSelectedSubject(e.target.value))}
                        required
                    />
                </div>
                <div className="form-element">
                    <label className="mt-2 mb-1">Message :</label>
                    <textarea
                        className="border-2 border-slate-500 p-1 bg-slate-900 h-32 w-96"
                        value={message}
                        onChange={(e) => setMessage(setSelectedMessage(e.target.value))}
                        required
                    />
                </div>
                <button
                    className="border-rounded border-slate-400 text-slate-200 bg-blue-600 hover:bg-blue-700 mx-auto mt-5 px-2 py-0"
                    type="submit">
                    Envoyer
                </button>
            </form>

            {showEvent && <p className="text-xl text-white">{response}</p>}

            {error && (
                <p className="text-red-500 text-center text-xl font-medium">
                    {error}
                </p>
            )}
        </div>
    )
}
