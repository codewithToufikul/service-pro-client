import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

function ManageFaq() {
  const [faqData, setFaqData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://servies-pro-server.onrender.com/faq')
      const data = await response.json()
      setFaqData(data)
    } catch (error) {
      console.error('Error fetching FAQ:', error)
    }
    setLoading(false)
  }

  const handleAddFaq = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://servies-pro-server.onrender.com/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('FAQ added successfully!')
        setFormData({ question: '', answer: '' })
        fetchFaqs()
      } else {
        toast.error('Failed to add FAQ')
      }
    } catch (error) {
      toast.error('Error adding FAQ')
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/faq/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        toast.success('FAQ deleted successfully')
        fetchFaqs()
      } else {
        toast.error('Failed to delete FAQ')
      }
    } catch (error) {
      toast.error('Error deleting FAQ')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage FAQ</h1>

      {/* Add FAQ Form */}
      <form
        onSubmit={handleAddFaq}
        className="space-y-4 bg-white p-4 rounded-xl shadow mb-10"
      >
        <div>
          <label className="block font-semibold">Question</label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
            className="input input-bordered w-full mt-1"
          />
        </div>
        <div>
          <label className="block font-semibold">Answer</label>
          <textarea
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            required
            className="textarea textarea-bordered w-full mt-1"
          />
        </div>
        <button className="btn bg-teal-600 text-white" type="submit">
          Add FAQ
        </button>
      </form>

      {/* List All FAQs */}
      <div className="space-y-4">
        {faqData.map((faq) => (
          <div
            key={faq._id}
            className="p-4 bg-base-100 rounded-lg border border-base-300 shadow-sm"
          >
            <div className="font-semibold">{faq.question}</div>
            <div className="text-sm text-gray-600 mt-1">{faq.answer}</div>
            <button
              onClick={() => handleDelete(faq._id)}
              className="btn btn-xs btn-error mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageFaq
