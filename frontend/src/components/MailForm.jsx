import { useState, useEffect } from "react";

export default function MailForm({
    handleSubmit,
    recipients : initialRecipients,
    setRecipients,
    subject : initialSubject,
    setSubject,
    message : initialMessage,
    ccRecipients: initialCcRecipients,
    setCcRecipients,
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
    const [ccRecipients, updateCcRecipients] = useState(initialCcRecipients); // Nouvel état pour les destinataires CC
    const [showCcInput, setShowCcInput] = useState(false); // Nouvel état pour suivre si la case à cocher est cochée ou non


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
                className="justify-center border text-slate-100 border-slate-600 border-rounded px-6 py-6 my-3">
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
                        // onChange={(e) =>{
                        //     // console.log(e.target.value);
                        //     setSelectedRecipients(e.target.value.split(",").map((email) => email.trim()))
                        // }}
                        onChange={(e) =>{
                            const updatedRecipients = e.target.value.split(",").map((email) => email.trim());
                            setSelectedRecipients(updatedRecipients);
                            setRecipients(updatedRecipients);
                            }
                        }
                        placeholder="Séparer les adresses par une virgule"
                        required
                    />
                </div>

                <div className="form-element">
                    <div className="form-element" style={{ display: showCcInput ? 'block' : 'none' }}>
                        {/* <label className="mt-2 mb-1">Cc : </label> */}
                        <input
                            className="border-2 border-slate-500 p-1 bg-slate-900 w-96 mt-1"
                            type="text"
                            value={
                                Array.isArray(ccRecipients)
                                ? ccRecipients.join(",")
                                : ""
                            }
                            onChange={(e) =>{
                                const updateCc = e.target.value.split(",").map((email) => email.trim());
                                updateCcRecipients(updateCc)
                                setCcRecipients(updateCc)
                            }}
                            placeholder="Cc - Séparer les adresses par une virgule"
                            />
                    </div>
                    
                    <label>
                        Cc
                        <input
                            className="ml-2 cursor-pointer rounded"
                            type="checkbox"
                            onChange={() => setShowCcInput(!showCcInput)} // Inverse l'état de showCcInput lorsqu'on coche/décoche la case
                        />
                    </label>
                </div>

                <div className="form-element">
                    <label className="mt-2 mb-1">Objet :</label>
                    <input
                        className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                        type="text"
                        value={subject}
                        onChange={(e) => setSelectedSubject(setSubject(e.target.value))} // Mettre à jour le sujet du mail
                        required
                    />
                </div>

                <div className="form-element">
                    <label className="mt-2 mb-1">Message :</label>
                    <textarea
                        className="border-2 border-slate-500 p-1 bg-slate-900 h-32 w-96"
                        value={message}
                        onChange={(e) => setSelectedMessage(setMessage(e.target.value))} // Mettre à jour le message du mail
                        required
                    />
                </div>

                <button
                    className="rounded border-rounded border-slate-400 text-slate-200 bg-blue-600 hover:bg-blue-700 mx-auto mt-5 px-2 py-0.5"
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
