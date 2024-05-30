export default function MailForm({
    handleSubmit,
    recipients,
    setRecipients,
    subject,
    setSubject,
    message,
    setMessage,
}) {
    return (
        <form
            onSubmit={e => handleSubmit(e)}
            className="justify-center border text-slate-100 border-slate-600 border-rounded px-6 py-6">
            <div className="form-element">
                <label className="mt-2 mb-1">Destinataire(s) :</label>
                <input
                    className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                    type="text"
                    value={Array.isArray(recipients) ? recipients.join(",") : ""}
                    onChange={(e) => setRecipients(e.target.value.split(",").map(email => email.trim()))}
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
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div className="form-element">
                <label className="mt-2 mb-1">Message :</label>
                <textarea
                    className="border-2 border-slate-500 p-1 bg-slate-900 h-32 w-96"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <button
                className="border-rounded border-slate-400 text-slate-200 bg-blue-600 hover:bg-blue-700 mx-auto mt-5 px-2 py-0"
                type="submit">
                Envoyer
            </button>
        </form>
    )
}
