import React from 'react';

const ContactUs = () => {
  // Dummy data matching the format from your image
  const dummyContacts = [
    {
      name: "prinal rana",
      email: "ranagrimai@gmail.com",
      mobile: "9328638662",
      query: "mujhe mica kama hai"
    },
    {
      name: "john doe",
      email: "johndoe@example.com",
      mobile: "9876543210",
      query: "I want to know about pricing"
    },
    {
      name: "jane smith",
      email: "janesmith@example.com",
      mobile: "8765432109",
      query: "Product inquiry"
    },
    {
      name: "alex johnson",
      email: "alexj@example.com",
      mobile: "7654321098",
      query: "Technical support needed"
    },
    {
      name: "sara williams",
      email: "sara.w@example.com",
      mobile: "6543210987",
      query: "Partnership opportunity"
    }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Contact Us Form List</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>E-mail</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Mobile</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Query</th>
          </tr>
        </thead>
        <tbody>
          {dummyContacts.map((contact, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{contact.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{contact.email}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{contact.mobile}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{contact.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Previous</button>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Next</button>
      </div>
    </div>
  );
}

export default ContactUs;