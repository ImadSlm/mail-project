import React, { useState, useEffect } from "react"
import axios from "axios"
import loader from "./assets/loader.svg"

const App = () => {
    const [recipient, setRecipient] = useState("imad.saleem@hotmail.fr")
    const [subject, setSubject] = useState("subjtest")
    const [message, setMessage] = useState("msgtest")
    const [response, setResponse] = useState("")
    const [error, setError] = useState("")
    const [mailData, setMailData] = useState(null)
    const [showResponse, setShowResponse] = useState(false)
    const [emailAddress, setEmailAddress] = useState("")
    const [loading, setLoading] = useState(true)

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
        try {e.preventDefault()
        const response = await fetch("http://localhost:8080/get_mail")
        const data = await response.text()
        console.log(data)
        setMailData(data)}
        catch (error) {
            console.error("Failed to fetch mail data", error)
        }
    }

    useEffect(() => {
        const fetchEmailAddress = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/get_email_address"
                )
                setEmailAddress(res.data)
            } catch (error) {
                console.error("Failed to fetch email address", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEmailAddress()
    }, [])

    useEffect(() => {
        if (response) {
            setShowResponse(true)
            setTimeout(() => {
                setShowResponse(false)
            }, 5000)
        }
    }, [response])

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

                <form
                    onSubmit={handleSubmit}
                    className="justify-center border text-slate-100 border-slate-600 border-rounded px-6 py-6">
                    <div className="form-element">
                        <label className="mt-2 mb-1">Destinataire:</label>
                        <input
                            className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="mt-2 mb-1">Sujet:</label>
                        <input
                            className="border-2 border-slate-500 p-1 bg-slate-900 w-96"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-element">
                        <label className="mt-2 mb-1">Message:</label>
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

                <button
                    onClick={getMail}
                    className="border-rounded border-slate-400 text-slate-200 bg-green-700 mx-6 hover:bg-green-800 my-6 px-2 py-0">
                    Récuperer le mail
                </button>

                {mailData && (
                    <div className="mt-4 text-white">
                        <h6 className="text-2xl">Mail reçu:</h6>
                        <p>{mailData}</p>
                    </div>
                )}

                {showResponse && (
                    <p className="text-xl text-white">{response}</p>
                )}

                {error && (
                    <p className="text-red-500 text-center text-xl font-medium">
                        {error}
                    </p>
                )}
            </div>

            <footer className="fixed w-full border-t-2 border-slate-600 text-center text-slate-100 bottom-0 py-2">
                Mouad Moubtakir - Imad Saleem
            </footer>
        </div>
    )
}

export default App
