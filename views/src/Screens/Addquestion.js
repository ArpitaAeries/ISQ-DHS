import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
const Addquestion = ({question,productType,datastewardprop}) => {
  const [questionValue, setQuestionValue] = useState([]);
  const [categoryValue, setCategoryValue] = useState([]);
  const [datasteward, setDatasteward] = useState([]);

  const questions = ['Does the vendor maintain any formal security policies &  How often is the vendor’s security posture reviewed?', 
  'Will the vendor provide a copy of their last two security audit, penetration test, and/or vulnerability assessment?',
   'Are there current connections or servers that will need decommissioning once your new environment has moved to full production?',
  'If cloud solution, does the vendor use a third-party storage solution?If yes, does the data storage vendor have any third- party certifications or attestations, such as FedRamp, FIPS 140 -2,FISMA and DIACAP, HIPAA, ISO 27001, PCI-DSS, TRUSTe or SOC 1/SOC 2/ SSAE 16/ISAE 3402? If yes, provide certification or attestations'];
  
  
  const productTypes = ['Perform Platform','eS One DevOps','eS One Product Owner','Gemini,Perform','eS One Offshore','Corporate InfoSec','PerformPlatform','Corporate InfoSec'];
  const datastewards=['Tom Gregory','Jason Lee','Joe Gallagher','Garrett Dunne','James Power','Somsuvra Mukherjee','Chris Mielke','Jason','Jim Power','Jose']

  const handleApiCall = () => {
    console.log('API Call with Questions:', questionValue, 'and Categories:', categoryValue);
  };

  const getOptionLabel = (option) => (typeof option === 'string' ? option : '');

  return (
    <div className='formControls'>
      <div className='formControl'>
        <input
         type='text'
          placeholder='Question *'
          value={questionValue}
          onChange={(e) => {
            setQuestionValue(e.target.value) 
            question(e.target.value)
          }}/> 
      </div>

      <div className='formControl'>
        {/* <input
         type='text'
          placeholder='Product Type *'
          value={categoryValue}
          onChange={(e) =>{
             setCategoryValue(e.target.value)
             productType(e.target.value)
          }}
          />  */}
          <select value={categoryValue}
          onChange={(e) =>{
             setCategoryValue(e.target.value)
             productType(e.target.value)
          }}>
            <option value={null}>Select Product Type *</option>
            {productTypes.map((item,index)=>(
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
      </div>
      <div className='formControl'>
        {/* <input type='text'
         placeholder='Data Steward *'
         value={datasteward}
          onChange={(e) =>{
            setDatasteward(e.target.value)
            datastewardprop(e.target.value)
          }}
         />  */}
         <select value={datasteward}
          onChange={(e) =>{
            setDatasteward(e.target.value)
            datastewardprop(e.target.value)
          }}>
            <option value={null}>Select Data Steward *</option>
            {datastewards.map((item,index)=>(
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
      </div>
    </div>
  );
};

export default Addquestion;
