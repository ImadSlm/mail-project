import React, { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
    const [recipient, setRecipient] = useState("imad.saleem@hotmail.fr")
    const [subject, setSubject] = useState("subjtest")
    const [message, setMessage] = useState("msgtest")
    const [response, setResponse] = useState("")
    const [error, setError] = useState("")
    const [mailData, setMailData] = useState(null);
    const [showResponse, setShowResponse] = useState(false);

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

    const getMail = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/get_mail');
        const data = await response.text();
        console.log(data);
        setMailData(data);
    }

    useEffect(() => {
        if (response) {
            setShowResponse(true);
            setTimeout(() => {
                setShowResponse(false);
            }, 5000);
        }
    }, [response]);

    return (
        <div className="bg-slate-800 flex justify-center h-screen">
            <div className="ml-4 text-center">
                <h1 className="text-4xl font-semibold text-center text-white">
                    Client Mail
                </h1>
                <p className="text-slate-400 py-5 ml-4 ">
                    Connecté en tant que projetrustsender@outlook.com
                </p>
                <form onSubmit={handleSubmit} className="justify-center border text-slate-100 border-slate-600 border-rounded px-6 py-6">
                    <div className="form-element">
                        <label className="mt-2">Destinataire:</label>
                        <input
                            className="border-2 border-slate-400 bg-slate-900 ml-5"
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="mt-2">Sujet:</label>
                        <input
                            className="border-2 border-slate-400 bg-slate-900 ml-5 w-50"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="mt-2">Message:</label>
                        <textarea
                            className="border-2 border-slate-400 bg-slate-900 ml-5 h-32 w-96"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button className="border-rounded border-slate-400 text-slate-200 bg-blue-600 hover:bg-blue-700 mx-6 my-4 px-2 py-0" type="submit">
                        Envoyer
                    </button>
                </form>
                <button onClick={getMail} className="border-rounded border-slate-400 text-slate-200 bg-green-700 mx-6 hover:bg-green-800 my-6 px-2 py-0">
                    Récuperer le mail
                </button>
                {/* <p>{mailData}</p>
                {response && <p>{response}</p>} */}
                {showResponse && <p className="text-xl text-white">{response}</p>}
                {error && <p className="text-red-500 text-center text-xl font-medium">{error}</p>}
            </div>
            <footer className="fixed w-full text-center text-slate-100 bottom-0 py-2">Mouad Moubtakir - Imad Saleem</footer>
        </div>
    )
}

export default App
