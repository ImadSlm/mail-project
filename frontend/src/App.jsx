import React, { useState } from "react"
import axios from "axios"

const App = () => {
    const [recipient, setRecipient] = useState("imad.saleem@hotmail.fr")
    const [subject, setSubject] = useState("subjtest")
    const [message, setMessage] = useState("msgtest")
    const [response, setResponse] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const res = await axios.post("http://localhost:8080/send_email", {
                recipient,
                subject,
                message,
            })
            console.log(res)
            setResponse(res.data)
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setError("Une erreur interne du serveur est survenue.")
            } else {
                setError(`Erreur : ${error.message}`)
            }
        }
    }

    return (
        <div className="bg-slate-800">
            <div className="ml-4">
                <h1 className="text-4xl font-semibold text-center text-white">
                    Client Mail
                </h1>
                <p className="text-slate-400 py-5 ml-4 ">
                    Connecté en tant que projetrustsender@outlook.com
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-element">
                        <label className="text-white">Destinataire:</label>
                        <input
                            className="border-2 border-slate-400 ml-5"
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="text-white">Sujet:</label>
                        <input
                            className="border-2 border-slate-400 ml-5 w-50"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="text-white">Message:</label>
                        <textarea
                            className="border-2 border-slate-400 ml-5 h-32 w-96"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button className="border-rounded border-slate-400 bg-blue-500 mx-6 my-6 px-2 py-0" type="submit">
                        Envoyer
                    </button>
                </form>
                {response && <p>{response}</p>}
                {error && <p className="text-red-500 text-center text-xl font-medium">{error}</p>}
            </div>
            <footer className="fixed w-full text-center bottom-0 py-2">Mouad Moubtakir - Imad Saleem</footer>
        </div>
    )
}

export default App
