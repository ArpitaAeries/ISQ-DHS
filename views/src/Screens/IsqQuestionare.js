import React, { useState } from 'react'
import Addquestion from './Addquestion'
function IsqQuestionare() {
  let [formValue,setFormValue]=useState({quarter:'Q1',year:'2023',file:null})
  let [data,setData]=useState([])
  const hangleFile = (event)=>{
    setFormValue({...formValue,file:event.target.files[0]})
  }
  const formSubmit=(event)=>{
    event.preventDefault()
    const formdata = new FormData();
    formdata.append("file", formValue.file);
    const requestOptions = {
      method: "POST",
      body: formdata
    };
    
    fetch("http://127.0.0.1:5000/upload_form", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        let modifiedData = res.result.map(item => ({ ...item, isAccepted: false }));
        setData(modifiedData)
      })
      .catch((error) => console.error(error));
  }

  const onAccept=(arg)=>{
    console.log(arg)
    const parm = {
      "Question": arg.Questions,
      "quarter": formValue.quarter,
      "year": formValue.year,
      "Answer":arg.Answers
    };
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parm)
    };
    
    fetch("http://127.0.0.1:5000/accept", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        const updatedData = data.map(item => 
          item.Questions === arg.Questions ? { ...item, isAccepted: true } : item
        );
        setData(updatedData);
        alert('Data Accepted')
      })
      .catch((error) => console.error(error));
  }

  const onReject=(arg)=>{
    const url = 'http://localhost:5000/reject_record';  // Replace with your server URL

    const parm = {
      "question":arg.Questions
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parm)
    })
      .then(response => response.json())
      .then(res => {
        console.log('Success:', res);
        const updatedData = data.map(item => 
          item.Questions === arg.Questions ? { ...item, isAccepted: false } : item
        );
        setData(updatedData);
        alert('Record rejected successfully')
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  return (
    <>
      <form onSubmit={formSubmit}>
        <div className='formControls'>
          <div className='formControl'>
            <label>Select Quarter</label>
            <select value={formValue.quarter} onChange={(e)=>setFormValue({...formValue,quarter:e.target.value})}>
              <option value={'Q1'}>Q1</option>
              <option value={'Q2'}>Q2</option>
              <option value={'Q3'}>Q3</option>
              <option value={'Q4'}>Q4</option>
            </select>
          </div>
          <div className='formControl'>
          <label>Select Year</label>
            <select value={formValue.year} onChange={(e)=>setFormValue({...formValue,year:e.target.value})}>
              <option value={'2024'}>2024</option>
              <option value={'2023'}>2023</option>
              <option value={'2022'}>2022</option>
              <option value={'2021'}>2021</option>
            </select>
          </div>
          <div className='formControl'>
            <input type='file' onChange={(e)=>hangleFile(e)}/>
          </div>
          <div className=''>
            <button type='submit'>Submit</button>
          </div>
        </div>
      </form>
      <Addquestion />
      <div>
      { data.length!==0 &&
        <table>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
          {
            data?.map((item,index)=>(
              <tr key={index}>
                <td>{item.Questions}</td>
                <td>{item.Answers}</td>
                <td>
                  {item.isAccepted?
                    <button onClick={()=>onReject(item)}>Reject</button>:
                    <button onClick={()=>onAccept(item)}>Accept</button>
                  }
                </td>
              </tr>
            ))
          }
        </table>
      }
      </div>
    </>
  )
}

export default IsqQuestionare