import React, { useState, useEffect } from 'react';
import Addquestion from './Addquestion';
import Loading from '../components/Loading';
import DatePicker from "react-datepicker";
import Checkbox from '@mui/material/Checkbox';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import sample from '../assets/files/sample.xlsx';

import "react-datepicker/dist/react-datepicker.css";

let basePath = "https://llmusecases.aeriestechnology.com/isqapi/";

function IsqQuestionare() {
  let [formValue, setFormValue] = useState({ quarter: 'Q1', year: '2023', file: null, type: 'Single', startDate: null });
  let [loader, setLoader] = useState(false);
  let [question, setQuestion] = useState(null);
  let [category, setCategory] = useState('eS One');
  let [dataSteward, setDataSteward] = useState(null);

  const categories = ['eS One', 'Perform Platform', 'Gemini', 'Corporate InfoSec'];

  let [data, setData] = useState([]);
  let [selectedItems, setSelectedItems] = useState([]);
  let [selectAll, setSelectAll] = useState(false);
  let [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectAll(false);
      setIndeterminate(false);
    } else if (selectedItems.length === data.length) {
      setSelectAll(true);
      setIndeterminate(false);
    } else {
      setSelectAll(false);
      setIndeterminate(true);
    }
  }, [selectedItems, data]);

  const handleFile = (event) => {
    setFormValue({ ...formValue, file: event.target.files[0] });
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data);
    }
    setSelectAll(!selectAll);
  };

  const formSubmit = (event) => {
    event.preventDefault();

    const formdata = new FormData();
    if (formValue.type == 'Bulk') {
      if (!formValue.file) {
        alert('Please upload file');
        return;
      }
      setLoader(true);
      let path = basePath + 'process_excel';
      formdata.append("file", formValue.file);
      const requestOptions = {
        method: "POST",
        body: formdata
      };

      fetch(path, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          let modifiedData = res.result.map(item => ({ ...item, isAccepted: false }));
          console.log(modifiedData);
          setData(modifiedData);
          setLoader(false);
          alert('File Uploaded successfully');
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });
    } else {
      if (question == null || category == null || question == '' || category == '' || category == 'Select Product Type *') {
        alert('Please fill all details');
        return;
      }
      setLoader(true);
      let path = basePath + 'get_custom_answer';
      let data = {
        "Question": question,
        "productType": category,
        "dataSteward": dataSteward
      };
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      };

      fetch(path, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          let modifiedData = [res].map(item => ({ ...item, isAccepted: false }));
          setData(modifiedData);
          setLoader(false);
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });
    }
  };

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
        console.log(updatedData);
        setData(updatedData);
        alert('Data Accepted');
      })
      .catch((error) => console.error(error));
  };

  const onReject = async (arg) => {
    const url = basePath + 'reject_record';

    const parm = {
      "question": arg.question
    };

    await fetch(url, {
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
          item.question === arg.question ? { ...item, isAccepted: false } : item
        );
        setData(updatedData);
        alert('Record rejected successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });

    const updatedData = data.filter(item =>
      item.question !== arg.question
    );
    setData(updatedData);
  };

  const handleQuestion = (val) => {
    setQuestion(val);
  };

  const handleProductType = (val) => {
    setCategory(val);
  };

  const handleDatastewardprop = (val) => {
    setDataSteward(val);
  };

  // const bulkAccept = async () => {
  //   for (const item of selectedItems) {
  //     await onAccept(item);
  //   }
  //   setSelectedItems([]);
  // };

  // const bulkReject = async () => {
  //   for (const item of selectedItems) {
  //     await onReject(item);
  //   }
  //   setSelectedItems([]);
  // };

  const bulkAccept = async () => {
    const recordsToAccept = selectedItems.map(item => ({
      Question: item.question,
      quarter: formValue.quarter,
      year: formValue.year,
      answer: item.context,
      productType: item.productType,
      date: item.date,
      dataSteward: item.dataSteward
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordsToAccept)
    };

    await fetch(basePath + "bulk_accept", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        const updatedData = data.map(item =>
          selectedItems.includes(item) ? { ...item, isAccepted: true } : item
        );
        setData(updatedData);
        setSelectedItems([]);
        alert('Data Accepted');
      })
      .catch((error) => console.error(error));
  };

  const bulkReject = async () => {
    const recordsToReject = selectedItems.map(item => ({
      question: item.question
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordsToReject)
    };

    await fetch(basePath + "bulk_reject", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        const updatedData = data.filter(item => !selectedItems.includes(item));
        setData(updatedData);
        setSelectedItems([]);
        alert('Records rejected successfully');
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Header />
      <section className='global_flex'>
        <SideMenu />
        <div className='data_table'>
          {loader && <Loading />}
          <form onSubmit={formSubmit} className='form_container'>
            <div className='formControls'>
              <div className='formControl'>
                <label>Select Type*</label>
                <select value={formValue.type} onChange={(e) => setFormValue({ ...formValue, type: e.target.value })}>
                  <option value={'Single'}>Single</option>
                  <option value={'Bulk'}>Bulk</option>
                </select>
              </div>
              {formValue.type == 'Bulk' ?
                <div className='formControl' style={{ marginTop: '30px' }}>
                  <input type='file' onChange={(e) => handleFile(e)} />
                </div> :
                <Addquestion question={handleQuestion} productType={handleProductType} datastewardprop={handleDatastewardprop} />
              }
              <div className='text-center w-100'>
                <button type='submit'>Submit</button>
                {formValue.type === 'Bulk' && <a className='downloadButton' download href={sample}>Download Sample</a>}
                {formValue.type === 'Bulk' &&<button type='button' onClick={bulkAccept}>Bulk Accept</button>}
                {formValue.type === 'Bulk' &&<button type='button' onClick={bulkReject}>Bulk Reject</button>}
              </div>
            </div>
          </form>

          <div className='data_container'>
            {data.length !== 0 &&
              <table>
                <thead>
                  <tr>
                  {formValue.type === 'Bulk' &&
                    <th>
                      <Checkbox
                        checked={selectAll}
                        indeterminate={indeterminate}
                        onChange={handleSelectAll}
                      />
                    </th>}
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Product Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                       {formValue.type === 'Bulk' &&
                        <td>
                          <Checkbox
                            checked={selectedItems.includes(item)}
                            onChange={() => handleSelectItem(item)}
                          />
                        </td>
                      }
                      <td>{item.question}</td>
                      <td>{item.context}</td>
                      <td>{item.productType}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => onReject(item)}>Reject</button>
                          <button onClick={() => onAccept(item)}>Accept</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default IsqQuestionare;
