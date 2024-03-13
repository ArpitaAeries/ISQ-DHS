import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

const Addquestion = ({question,productType}) => {
  const [questionValue, setQuestionValue] = useState([]);
  const [categoryValue, setCategoryValue] = useState([]);

  const questions = ['Does the vendor maintain any formal security policies &  How often is the vendor’s security posture reviewed?', 
  'Will the vendor provide a copy of their last two security audit, penetration test, and/or vulnerability assessment?',
   'Are there current connections or servers that will need decommissioning once your new environment has moved to full production?',
  'If cloud solution, does the vendor use a third-party storage solution?If yes, does the data storage vendor have any third- party certifications or attestations, such as FedRamp, FIPS 140 -2,FISMA and DIACAP, HIPAA, ISO 27001, PCI-DSS, TRUSTe or SOC 1/SOC 2/ SSAE 16/ISAE 3402? If yes, provide certification or attestations'];
  
  
  const categories = ['eS One DevOps', 'Perform Platform', 'eS One Product Owner', 'Gemini','Corporate InfoSec'];

  const handleApiCall = () => {
    console.log('API Call with Questions:', questionValue, 'and Categories:', categoryValue);
  };

  const getOptionLabel = (option) => (typeof option === 'string' ? option : '');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          
          id="question-autocomplete"
          size="small"
          options={questions}
          value={questionValue}
          onChange={(_, newValue) => {
            setQuestionValue(newValue) 
            question(newValue)
          }}
          freeSolo
          getOptionLabel={getOptionLabel}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                onDelete={() => {
                  const newValues = [...questionValue];
                  newValues.splice(index, 1);
                  setQuestionValue(newValues);
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Question"
              placeholder="Question"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          
          id="category-autocomplete"
          size="small"
          options={categories}
          value={categoryValue}
          onChange={(_, newValue) =>{
             setCategoryValue(newValue)
             productType(newValue)
          }}
          freeSolo
          getOptionLabel={getOptionLabel}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                onDelete={() => {
                  const newValues = [...categoryValue];
                  newValues.splice(index, 1);
                  setCategoryValue(newValues);
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Product Type"
              placeholder="Product Type"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Addquestion;
