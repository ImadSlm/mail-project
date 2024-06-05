import Modal from "./Modal"
import { useMemo } from "react"
import Filter from "./Filter"

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
}) {
    return (
        <div className="flex flex-col text-slate-300 mb-10">
            <h1 className="text-2xl font-semibold text-center border-b-2 pb-2 text-white">
                Boite de réception
            </h1>

            <Filter
                showRead={showRead}
                setShowRead={setShowRead}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <ul>
                {(showRead
                    ? filteredEmails
                    : filteredEmails.filter((email) => !email.is_read)
                ).map((email) => (
                    <li
                        className={`relative my-2 border-2 ${
                            email.is_read
                                ? "border-slate-600"
                                : "border-slate-400"
                        } p-2 cursor-pointer hover:bg-slate-700`}
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
                            <u>De :</u> {email.author}
                        </p>
                        <p>{email.subject}</p>
                        <p>
                            <u>Date :</u> {email.date}
                        </p>
                    </li>
                ))}
            </ul>
            {selectedEmail && (
                <Modal onClose={() => setSelectedEmail(null)}>
                    <button
                        className="bg-blue-500 absolute flex hover:bg-blue-700 text-white  h-8 rounded px-3 py-1 top-2 left-2"
                        onClick={() => handleReply(selectedEmail)}>
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
                    <h2>{selectedEmail.subject}</h2>
                    <p>{selectedEmail.body}</p>
                    <p>
                        <strong>Date:</strong> {selectedEmail.date}
                    </p>
                </Modal>
            )}
        </div>
    )
}
