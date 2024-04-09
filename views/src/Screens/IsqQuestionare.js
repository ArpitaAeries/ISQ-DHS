import React, { useState } from 'react'
import Addquestion from './Addquestion'
import Loading from '../components/Loading'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

import sample from '../assets/files/sample.xlsx'

let basePath="https://llmusecases.aeriestechnology.com/isqapi/"
function IsqQuestionare() {
  let [formValue,setFormValue]=useState({quarter:'Q1',year:'2023',file:null,type:'Single',startDate:null})
  let [loader,setLoader]=useState(false)
  let [question,setQuestion]=useState(null)
  let [category,setCategory]=useState(null)
  let [dataSteward,setDataSteward]=useState(null)


  const categories = ['eS One', 'Perform Platform', 'Gemini','Corporate InfoSec'];
  
  let [data,setData]=useState([])
  const hangleFile = (event)=>{
    setFormValue({...formValue,file:event.target.files[0]})
  }


  const formSubmit=(event)=>{
    event.preventDefault()

    const formdata = new FormData();
    if(formValue.type=='Bulk'){
      if(!formValue.file){
          alert('Please upload file')
          return
      }
      setLoader(true)
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
          console.log(modifiedData)
          setData(modifiedData)
          setLoader(false)
          alert('File Uploaded successfully')
        })
        .catch((error) => {console.error(error)  
          setLoader(false)});
    }else{
      if(formValue.startDate==null || question==null || category==null || dataSteward==null || question=='' || category=='' || dataSteward=='' || dataSteward=='Select Data Steward *' || category=='Select Product Type *'){
          alert('Please fill all details')
          return
      }
      setLoader(true)
      let path=basePath+'get_custom_answer'
      let data={
        "Question":question,
        "productType":category,
        "date":formValue.startDate,
        "dataSteward":dataSteward
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
  

  const onAccept = async (arg) => {
    const parm = {
      "Question": arg.question,
      "date": arg.date,
      "quarter": formValue.quarter,
      "year": formValue.year,
      "answer": arg.context,
      "productType": arg.productType,
      "dataSteward": arg.dataSteward
    };
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parm)
    };
  
    await fetch(basePath + "accept", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        const updatedData = data.map(item =>
          item.question === arg.question ? { ...item, isAccepted: true } : item
        );
        console.log(updatedData)
        setData(updatedData);
        alert('Data Accepted')
      })
      .catch((error) => console.error(error));
  }
  

  const onReject=(arg)=>{
    const url = basePath+'reject_record';

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
  const handleDatastewardprop=(val)=>{
    setDataSteward(val)
  }
  return (
    <>
    <Header/>
   <section className='global_flex'>
   <SideMenu/>
      <div className='data_table'>
      {loader && <Loading/>}
      <form onSubmit={formSubmit} className='form_container'>
        <div className='formControls'>
        <div className='formControl'>
            <label>Select Type*</label>
            <select value={formValue.type} onChange={(e)=>setFormValue({...formValue,type:e.target.value})}>
              <option value={'Single'}>Single</option>
              <option value={'Bulk'}>Bulk</option>
            </select>
          </div>


          {formValue.type!=='Bulk' &&
          <div className='formControl custom-datepicker'>
            <label>Select Date*</label>
          <input 
          className="custom-datepicker-input"
          type='date' value={formValue.startDate} onChange={(e)=>setFormValue({...formValue,startDate:e.target.value})} />
          <div className="custom-calendar-icon">

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4dd7ce" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  </div>
          </div>
          }
          
          {/* <div className='formControl'>
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
          </div> */}
          {formValue.type=='Bulk' ?
          <div className='formControl'>
            <input type='file' onChange={(e)=>hangleFile(e)}/>
          </div>:
           <Addquestion question={handleQuestion} productType={handleProductType} datastewardprop={handleDatastewardprop}/>
           }
          <div className='text-center w-100'>
            <button type='submit'>Submit</button>
            {formValue.type=='Bulk' &&  <a className='downloadButton' download href={sample}>Download Sample</a>}
          </div>
        </div>
      </form>

      <div className='data_container'>
      { data.length!==0 &&
        <table>
          <tr>
            <th>Question</th>
            {/* <th>Answer</th> */}
          
            <th>Answer</th>
            <th>Date</th>
            <th>Product Type</th>
            <th>Data Steward</th>
            <th>Action</th>
          </tr>
          {
            data?.map((item,index)=>(
              <tr key={index}>
                <td>{item.question}</td>
                {/* <td>{item?.answer[0]?.answer}</td> */}
              
                <td>{item?.context}</td>
                <td>{item?.date}</td>
                <td>{item?.productType}</td>
                <td>{item?.dataSteward}</td>
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
      </div>
     
   </section>

  
    </>
  )
}

export default IsqQuestionare