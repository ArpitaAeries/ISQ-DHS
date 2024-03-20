import React, { useState } from 'react'
import Addquestion from './Addquestion'
import Loading from '../components/Loading'
let basePath="https://llmusecases.aeriestechnology.com/isqapi/"
function IsqQuestionare() {
  let [formValue,setFormValue]=useState({quarter:'Q1',year:'2023',file:null,type:'Single'})
  let [loader,setLoader]=useState(false)
  let [question,setQuestion]=useState(null)
  let [category,setCategory]=useState(null)

  const categories = ['eS One DevOps', 'Perform Platform', 'eS One Product Owner', 'Gemini','Corporate InfoSec'];
  
  let [data,setData]=useState([])
  const hangleFile = (event)=>{
    setFormValue({...formValue,file:event.target.files[0]})
  }


  const formSubmit=(event)=>{
    event.preventDefault()
    const formdata = new FormData();
    setLoader(true)
    if(formValue.type=='Bulk'){
      let path=basePath+'process_excel'
      formdata.append("file", formValue.file);
      const requestOptions = {
        method: "POST",
        body: formdata
      };
      
      fetch(path, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          let modifiedData = res.result.map(item => ({ ...item, isAccepted: false }));
          setData(modifiedData)
          setLoader(false)
        })
        .catch((error) => {console.error(error)  
          setLoader(false)});
    }else{
      let path=basePath+'get_custom_answer'
      let data={
        "Question":question,
        "productType":category
      }
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json',
        }
      };
      
      fetch(path, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          let modifiedData = [res].map(item => ({ ...item, isAccepted: false }));
          setData(modifiedData)
          setLoader(false)
        })
        .catch((error) => {
          console.error(error)
          setLoader(false)
        });
    } 
  }
  

  const onAccept=(arg)=>{
    const parm = {
      "Question": arg.question,
      "quarter": formValue.quarter,
      "year": formValue.year,
      // "answer":arg.answer[0]?.answer,
      "answer":arg.context,
      "productType":arg.productType,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parm)
    };
    
    fetch(basePath+"accept", requestOptions)
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

  const handleQuestion=(val)=>{
    setQuestion(val)
  }

  const handleProductType=(val)=>{
    setCategory(val)
  }
  return (
    <>
      {loader && <Loading/>}
      <form onSubmit={formSubmit}>
        <div className='formControls'>
        <div className='formControl'>
            <label>Select Type</label>
            <select value={formValue.type} onChange={(e)=>setFormValue({...formValue,type:e.target.value})}>
              <option value={'Single'}>Single</option>
              <option value={'Bulk'}>Bulk</option>
            </select>
          </div>
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
          {formValue.type=='Bulk' ?
          <div className='formControl'>
            <input type='file' onChange={(e)=>hangleFile(e)}/>
          </div>:
           <Addquestion question={handleQuestion} productType={handleProductType}/>
           }
          <div className=''>
            <button type='submit'>Submit</button>
          </div>
        </div>
      </form>
      <div>
      { data.length!==0 &&
        <table>
          <tr>
            <th>Question</th>
            {/* <th>Answer</th> */}
            <th>Product Type</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
          {
            data?.map((item,index)=>(
              <tr key={index}>
                <td>{item.question}</td>
                {/* <td>{item?.answer[0]?.answer}</td> */}
                <td>{item?.productType}</td>
                <td>{item?.context}</td>
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