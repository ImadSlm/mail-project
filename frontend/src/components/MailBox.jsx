import Modal from "./Modal"
import { useMemo } from "react"
import Filter from "./Filter"
import { useState } from "react"
import { useEffect } from "react";

export default function MailBox({
    emails,
    setEmails,
    showRead,
    setShowRead,
    sortBy,
    setSortBy,
    filteredEmails,
    selectedEmail,
    setSelectedEmail,
    handleReply,
    markAsRead,
    showEvent,
    response,

}) {

    const [replyReady, setReplyReady] = useState(false) // Nouveau state pour gérer la préparation de la réponse
    const [replyText, setReplyText] = useState(''); // Nouveau state pour stocker le texte de réponse

useEffect(() => {
    if (selectedEmail) {
        setReplyText(`\n\n----\n${selectedEmail.body}`);
    }
}, [selectedEmail]);

    return (
        <div className="flex flex-col text-slate-300 mb-32">
            <h1 className="text-2xl font-semibold text-center border-b-2 pb-2 text-white">
                Boite de réception
            </h1>

            <Filter
                showRead={showRead}
                setShowRead={setShowRead}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <ul className="z-0">
                {(showRead
                    ? filteredEmails
                    : filteredEmails.filter((email) => !email.is_read)
                ).map((email) => (
                    <li
                        className={`relative my-2 border-2 ${
                            email.is_read
                                ? "border-slate-600"
                                : "border-slate-400"
                        } p-3 cursor-pointer hover:bg-slate-700`}
                        key={email.id}
                        style={{
                            fontWeight: email.is_read ? "normal" : "bold",
                        }}
                        onClick={() => {
                            const newEmails = emails.map((e) =>
                                e.id === email.id ? { ...e, is_read: true } : e
                            )
                            setEmails(newEmails)
                            setSelectedEmail(email)
                            markAsRead(email.id)
                            setShowRead(true)
                        }}>
                        {!email.is_read && (
                            <span
                                className="absolute top-1 right-1"
                                role="img"
                                aria-label="unread">
                                🔵
                            </span>
                        )}
                        <p>
                            <span className="underline underline-offset-2">De</span> : {email.author}
                        </p>
                        <p>{email.subject}</p>
                        <p className="absolute bottom-1 right-1 p-1">
                            <span className="underline underline-offset-2">Date</span> : {email.date}
                        </p>
                    </li>
                ))}
            </ul>
            {selectedEmail && (
                <Modal onClose={() => setSelectedEmail(null)}>
                    {replyReady && ( // Afficher le formulaire de réponse uniquement lorsque replyReady est vrai
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleReply(selectedEmail, replyText) // Envoyer la réponse lorsque le formulaire est soumis
                                setSelectedEmail(null) // Fermer le modal après l'envoi
                            }}>
                            <label className="mt-2 mb-1">À :</label>
                            <input
                                className="form-element border-2 border-slate-500 p-1 bg-slate-200 rounded w-96"
                                type="text"
                                value={selectedEmail.author} // Préremplir le champ "À"
                                readOnly
                            />
                            <input
                                className="form-element border-2 border-slate-500 p-1 bg-slate-200 rounded w-96"
                                type="text"
                                value={`RE: ${selectedEmail.subject}`} // Préremplir le champ "Sujet"
                                readOnly
                            />
                            <textarea
                                className="form-element border-2 border-slate-500 p-1 bg-slate-200 rounded h-32 w-96"
                                value={replyText} // Préremplir le champ "Message"
                                onChange={(e) => {
                                    setReplyText(e.target.value) // Mettre à jour le texte de réponse
                                    setReplyReady(true) // Activer la réponse une fois que le champ de message est modifié
                                }}
                            />
                            <button
                                className="flex items-center rounded border-rounded border-slate-400 text-slate-200 bg-blue-600 hover:bg-blue-700 mx-auto mt-2 mb-6 px-2 py-0.5"
                                type="submit">
                                Envoyer
                            </button>
                        </form>
                    )}
                    {showEvent && <p className="text-xl text-white">{response}</p>}
                    <button
                        className="bg-blue-500 absolute flex hover:bg-blue-700 text-white  h-8 rounded px-3 py-1 top-2 left-2"
                        onClick={() => (setReplyReady(!replyReady))}>
                        ⤵️ Répondre
                    </button>
                    <button
                        className="bg-red-600 absolute flex hover:bg-red-800 text-white w-8 h-8 rounded px-3 py-1 top-2 right-2"
                        onClick={() => setSelectedEmail(null)}>
                        X
                    </button>
                    <p>
                        <strong>De :</strong> {selectedEmail.author}
                    </p>
                    <p>
                        <strong>À :</strong>{" "}
                        {selectedEmail.recipients.join(", ")}
                    </p>
                    <h2 className="underline underline-offset-2 font-medium"><strong>Objet : </strong>{selectedEmail.subject}</h2>
                    <p className="px-1 mt-1 border-l-2 border-slate-600">{selectedEmail.body}</p>
                    <p className="mt-2">
                        <strong>Date:</strong> {selectedEmail.date}
                    </p>
                </Modal>
            )}
            <p className="text-slate-400 text-center mt-6">- {filteredEmails.length} mails - Il n'y a pas d'autres mails 📩 -</p>
        </div>
    )
}
