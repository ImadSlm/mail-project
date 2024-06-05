/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import loader from "./assets/loader.svg"
import MailForm from "./components/MailForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import MailBox from "./components/MailBox"
// import Modal from "./components/Modal"
// import Filter from "./components/Filter"

export default function App() {
    const [recipients, setRecipients] = useState(["saleem@et.esiea.fr"])
    const [subject, setSubject] = useState("sujet test")
    const [message, setMessage] = useState("msg test")
    const [response, setResponse] = useState("")
    const [error, setError] = useState("")
    const [mailData, setMailData] = useState(null)
    const [showEvent, setShowEvent] = useState(false)
    const [emailAddress, setEmailAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [emails, setEmails] = useState([]) // Added state to hold fetched emails
    const [showRead, setShowRead] = useState(true)
    const [sortBy, setSortBy] = useState("date")
    const [selectedEmail, setSelectedEmail] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const res = await axios.post("http://localhost:8080/send_email", {
                recipients,
                subject,
                message,
                in_reply_to: selectedEmail ? selectedEmail.id : null,
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

    const markAsRead = async (id) => {
        try {
            await axios.post(`http://localhost:8080/mark_as_read/${id}`);
        } catch (error) {
            console.error(`Failed to mark email as read: ${error}`);
        }
    }

    const getMail = async (e) => {
        try {
            e.preventDefault()
            const response = await fetch("http://localhost:8080/get_mail")
            const data = await response.text()
            console.log(data)
            setMailData(data)
        } catch (error) {
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
            setShowEvent(true)
            setTimeout(() => {
                setShowEvent(false)
            }, 5000)
        }
    }, [response])

    useEffect(() => {
        const fetchEmails = async () => {
            const response = await axios.get("http://127.0.0.1:8080/get_emails") // Added to fetch emails from backend
            setEmails(response.data) // Set fetched emails to state
        }
        fetchEmails()
    }, [])

    const sortedEmails = useMemo(() => {
        return[...emails].sort((a, b) => {
            if (sortBy === "date") {
                return new Date(b.date) - new Date(a.date)
            } else if (sortBy === "recipient") {
                return a.recipients[0].localeCompare(b.recipients[0])
            }
            return 0
        })
    }, [emails, sortBy]);

    const filteredEmails = useMemo(() => {
        return showRead ? sortedEmails : sortedEmails.filter((email) => !email.is_read);
    }, [sortedEmails, showRead]);

    const handleReply = (email) => {
        setRecipients([email.author])
        setSubject(`RE: ${email.subject}`)
        setMessage(`\n\n----\n${email.body}`)
        setSelectedEmail(null)
    }

    return (
        <div className="bg-gradient-to-b from-slate-800 to-black flex justify-center sm:h-screen h-full">
            <Header />
            <div className="mt-12 p-2 flex flex-col sm:flex-row">
                {/* <div className="text-center sm:mr-12 mr-0">
                    <h1 className="text-2xl font-semibold text-center border-b-2 pb-2 text-white">
                        Envoyer un mail
                    </h1>

                    <p className="text-slate-400 py-5 ml-4 ">
                        {loading || !emailAddress ? (
                            <img
                                src={loader}
                                className="mx-auto"
                                alt="Loading..."
                            />
                        ) : (
                            `Connecté en tant que ${emailAddress}`
                        )}
                    </p> */}

                    <MailForm
                        recipients={recipients}
                        setRecipients={setRecipients}
                        subject={subject}
                        setSubject={setSubject}
                        message={message}
                        setMessage={setMessage}
                        handleSubmit={handleSubmit}
                        showEvent={showEvent}
                        response={response}
                        error={error}
                        loading={loading}
                        emailAddress={emailAddress}
                        loader={loader}
                    />

                    {/* {mailData && (
                        <div className="mt-4 text-white">
                            <h6 className="text-2xl">Mail reçu:</h6>
                            <p>{mailData}</p>
                        </div>
                    )} */}

                    {/* {showEvent && (
                        <p className="text-xl text-white">{response}</p>
                    )}

                    {error && (
                        <p className="text-red-500 text-center text-xl font-medium">
                            {error}
                        </p>
                    )}
                </div> */}


                <MailBox 
                    emails={emails}
                    setEmails={setEmails}
                    showRead={showRead}
                    setShowRead={setShowRead}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filteredEmails={filteredEmails}
                    selectedEmail={selectedEmail}
                    setSelectedEmail={setSelectedEmail}
                    handleReply={handleReply}
                    markAsRead={markAsRead}
                />

            </div>
            <Footer />
        </div>
    )
}
