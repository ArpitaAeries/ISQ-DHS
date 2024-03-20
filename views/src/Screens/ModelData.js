import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
let basePath="https://llmusecases.aeriestechnology.com/isqapi/"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
const categories = ['eS One DevOps', 'Perform Platform', 'eS One Product Owner', 'Gemini','Corporate InfoSec'];

function ModelData() {
  let [formValue,setFormValue]=useState({quarter:'Q1',year:'2024',file:null,productType:'eS One DevOps'})
  let [data,setData]=useState([])
  let [filteredData,setFilteredData]=useState(false)
  let [selectedQy,setSelectedQy]=useState([])

  const [newfilteredData, setNewFilteredData] = useState(data);
  const [new1filteredData, setNew1FilteredData] = useState(data);
  const hangleFile = (event)=>{
    setFormValue({...formValue,file:event.target.files[0]})
  }
  const formSubmit=(event)=>{
    event.preventDefault()
    let newKey=formValue.quarter+formValue.year
    let filterData= data.filter(obj => {
        return Object.keys(obj).some(key => key.includes(newKey));
      });

    let filteredProductTypeData=filterData.filter(obj=>obj.productType==formValue.productType)
    console.log(filterData,filteredProductTypeData)
      setSelectedQy(newKey)
      setFilteredData(true)
      setNew1FilteredData(filteredProductTypeData)
  }
  const loadAfterUpdate=()=>{
    let newKey=formValue.quarter+formValue.year
    let filterData= data.filter(obj => {
        return Object.keys(obj).some(key => key.includes(newKey));
      });
      setSelectedQy(newKey)
    setFilteredData(filterData)
  }

  const onAccept=(arg)=>{
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

  const onReject=async(arg)=>{
    const url = 'http://localhost:5000/reject_record'; 
    const parm = {
      "question":arg.Question
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parm)
    })
      .then(response => response.json())
      .then(async(res) => {
        console.log('Success:', res);
        const updatedData = data.map(item => 
          item.Questions === arg.Questions ? { ...item, isAccepted: false } : item
        );
        setData(updatedData);
        await loadData()
        formSubmit()
        alert('Record rejected successfully')
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  const loadData=async()=>{
    await fetch(basePath+"get_all_data")
    .then((response) => response.json())
    .then((res) => {
      setData(res.data)
      setNewFilteredData(res.data)
    })
    .catch((error) => console.error(error));
  }
  useEffect(()=>{
    loadData()
    },[])

    const [open, setOpen] = React.useState(false);
    const [popUpData,setPopUpData]=useState(null);
    //const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const openPopUp = (val)=>{
      setOpen(true);
      const today = new Date();
      const month = today.getMonth() + 1;
      const quarter = Math.ceil(month / 3);
      const year = today.getFullYear();
      let qy=`Q${quarter}`.toString()+year.toString()
      console.log({...val,qy:qy})
      setPopUpData({...val,qy:qy})
    }

    const modify=()=>{
      const today = new Date();
      const month = today.getMonth() + 1;
      const quarter = Math.ceil(month / 3);
      const year = today.getFullYear();
        const parm = {
          "Question": popUpData.Question,
          "quarter": `Q${quarter}`.toString(),
          "year": year.toString(),
          "Answer":popUpData.UpdatedAnswer
        };
        const requestOptions = {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parm)
        };
        
        fetch(basePath+"update_record", requestOptions)
          .then((response) => response.json())
          .then(async(res) => {
            // const updatedData =  data.map(item => 
            //   item.Questions === popUpData.Questions ? { ...item, isAccepted: true } : item
            // );
            // setData(updatedData);
            window.location.reload()
            //await loadData()
            alert('Answer Modified')
            //loadAfterUpdate()
            handleClose()
          })
          .catch((error) => console.error(error));
          handleClose() 
    }

    // const extractQuarterYear = (data) => {
    //   const answers = [];
    
    //   for (const key in data) {
    //     if (/^Q\d{5}$/.test(key) && data[key]) {
    //       answers.push(`<strong>${key}</strong>:${data[key]}</br>`);
    //     }
    //   }
    
    //   return answers.join('');
    // };

    const extractLatestQuarterYear = (data) => {
      const quarters = [];
    
      for (const key in data) {
        if (/^Q(\d{1})(\d{4})$/.test(key) && data[key]) {
          const quarter = parseInt(RegExp.$1);
          const year = parseInt(RegExp.$2);
    
          quarters.push({ key, quarter, year });
        }
      }
    
      if (quarters.length === 0) {
        return ''; // No valid quarters found
      }
    
      // Sort quarters by year and quarter in descending order
      quarters.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        } else {
          return b.quarter - a.quarter;
        }
      });
    
      const latestQuarter = quarters[0];
    
      return `<strong>${latestQuarter.key}</strong>:${data[latestQuarter.key]}</br>`;
    };


    const handleSearch = (searchTerm) => {
      const filtered = data.filter(item =>
        item?.Question.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setNewFilteredData(filtered);
    }
    const handleNewSearch = (searchTerm) => {
      const filtered = filteredData?.filter(item =>
        item?.Question.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setNew1FilteredData(filtered);
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
          <label>Product Type</label>
            <select value={formValue.productType} onChange={(e)=>setFormValue({...formValue,productType:e.target.value})}>
              {categories.map((item,index)=>(
              <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>
          {/* <div className='formControl'>
            <input type='file' onChange={(e)=>hangleFile(e)}/>
          </div> */}
          <div className=''>
            <button type='submit'>Submit</button>
          </div>
        </div>
      </form>
      <div>
      { filteredData?
        <>
        <div>
          <input type="text" placeholder="Search by question" onChange={(e) => handleNewSearch(e.target.value)} style={{maxWidth:'300px',float:'right'}}/>
        </div>
        <table>
          <tr>
            <th>Question</th>
            <th>Answer({selectedQy})</th>
            <th>Product Type</th>
            <th>Verfied On</th>
            <th>Modify</th>
            {/* <th>Action</th> */}
          </tr>
          { new1filteredData &&
            new1filteredData?.map((item,index)=>(
              <tr key={index}>
                <td>{item.Question}</td>
                <td>{item[selectedQy]}</td>
                <td>{item.productType}</td>
                <td>{item.verifiedON}</td>
                <td><button onClick={()=>openPopUp(item)}>Modify</button></td>
              </tr>
            ))
          }
        </table>
        </>
        :
        <>
         <div>
          <input type="text" placeholder="Search by question" onChange={(e) => handleSearch(e.target.value)} style={{maxWidth:'300px',float:'right'}}/>
        </div>
        <table>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Product Type</th>
            <th>Verfied On</th>
            <th>Modify</th>
            {/* <th>Action</th> */}
          </tr>
          { newfilteredData &&
            newfilteredData?.map((item,index)=>(
              <tr key={index}>
                <td>{item.Question}</td>
                {/* <td>{extractQuarterYear(item)}</td> */}
                <td dangerouslySetInnerHTML={{ __html: extractLatestQuarterYear(item) }} />
                <td>{item.productType}</td>
                <td>{item.verifiedON}</td>
                <td><button onClick={()=>openPopUp(item)}>Modify</button></td>
              </tr>
            ))
          }
        </table>
        </>
        }
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Answer({popUpData?.qy})
          </Typography>
          <textarea value={popUpData?.UpdatedAnswer} onChange={(e)=>setPopUpData({...popUpData,UpdatedAnswer:e.target.value})} type='text' placeholder='Enter Answer' style={{width:'100%',height:'60px'}}/>
          <button onClick={handleClose}>Close</button>
          <button onClick={()=>modify()}>Modify</button>
        </Box>
      </Modal>
    </>
  )
}

export default ModelData