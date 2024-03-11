import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

const Addquestion = () => {
  const [questionValue, setQuestionValue] = useState([]);
  const [categoryValue, setCategoryValue] = useState([]);

  const questions = ['What is your name?', 'How are you?', 'What is the capital of France?']; // Add your questions
  const categories = ['General', 'Technology', 'Science', 'Travel']; // Add your categories

  const handleApiCall = () => {
    // Replace the following with your actual API call logic using questionValue and categoryValue
    console.log('API Call with Questions:', questionValue, 'and Categories:', categoryValue);
  };

  const getOptionLabel = (option) => (typeof option === 'string' ? option : '');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          multiple
          id="question-autocomplete"
          size="small"
          options={questions}
          value={questionValue}
          onChange={(_, newValue) => setQuestionValue(newValue)}
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
              placeholder="Favorites"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          multiple
          id="category-autocomplete"
          size="small"
          options={categories}
          value={categoryValue}
          onChange={(_, newValue) => setCategoryValue(newValue)}
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
              label="Category"
              placeholder="Favorites"
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleApiCall}>
          Call API
        </Button>
      </Grid>
    </Grid>
  );
};

export default YourComponent;
