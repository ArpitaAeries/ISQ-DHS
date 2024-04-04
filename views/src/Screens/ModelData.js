import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
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
//const categories = ['eS One DevOps', 'Perform Platform', 'eS One Product Owner', 'Gemini','Corporate InfoSec'];
const productTypes = ['Perform Platform','eS One DevOps','eS One Product Owner','Gemini','Perform','eS One Offshore','Corporate InfoSec'];
const datastewards=['Tom Gregory','Jason Lee','Joe Gallagher','Garrett Dunne','James Power','Somsuvra Mukherjee','Chris Mielke','Jason','Jim Power','Jose']

function ModelData() {
  let [formValue,setFormValue]=useState({startDate:'',endDate:'',productType:null,dataSteward:null})
  let [data,setData]=useState([])
  let [filteredData,setFilteredData]=useState(false)
  let [categories,setCategories]=useState([])
  let [dataSteward,setDataSteward]=useState([])

  const [newfilteredData, setNewFilteredData] = useState(data);
  const [new1filteredData, setNew1FilteredData] = useState(data);
  const hangleFile = (event)=>{
    setFormValue({...formValue,file:event.target.files[0]})
  }
  const formSubmit=(event)=>{
    event.preventDefault()
    const { startDate, endDate, productType, dataSteward } = formValue;
    if(startDate==''&&endDate=='' ){
      alert('Please select start date and end date')
      return
    }
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      const withinDateRange =
        (!startDateObj || itemDate >= startDateObj) &&
        (!endDateObj || itemDate <= endDateObj);

      const matchProductType = !productType || item.productType === productType;
      const matchDataSteward = !dataSteward || item.dataSteward === dataSteward;

      return withinDateRange && matchProductType && matchDataSteward;
    });
    console.log(filtered)
    setNewFilteredData(filtered)
    setNew1FilteredData(filtered)
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
      const currentDate = new Date();
      const sixMonthsAgo = new Date(currentDate);
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
      const filtered = res.data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sixMonthsAgo;
      });
      setCategories(res?.data.map((item)=>item.productType))
      setDataSteward(res?.data.map((item)=>item.dataSteward))
      setNewFilteredData(filtered)
      setNew1FilteredData(filtered)
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
    <Header/>
    <section className='global_flex'>
   
   <SideMenu/>
   <div className='data_table'>
      <form onSubmit={formSubmit}>
       <div className='form_container'>
       <div className='formControls'>
          <div className='formControl'>
            <label>Select Start Date*</label>
            <input type='date' value={formValue.startDate} onChange={(e)=>setFormValue({...formValue,startDate:e.target.value})} />

          </div>
          <div className='formControl'>
            <label>Select End Date*</label>
            <input type='date' value={formValue.endDate} onChange={(e)=>setFormValue({...formValue,endDate:e.target.value})} />
          </div>
          <div className='formControl'>
           <label>Product Type</label>
            <select value={formValue.productType} onChange={(e)=>setFormValue({...formValue,productType:e.target.value})}>
            <option value={null}>Select</option>
              {productTypes.map((item,index)=>(
              <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className='formControl'>
           <label>Data Steward</label>
            <select value={formValue.dataSteward} onChange={(e)=>setFormValue({...formValue,dataSteward:e.target.value})}>
            <option value={null}>Select</option>
              {datastewards.map((item,index)=>(
              <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>
          {/* <div className='formControl'>
            <input type='file' onChange={(e)=>hangleFile(e)}/>
          </div> */}
          <div className='text-center w-100'>
            <button type='submit' className='mr-5'>Filter</button>
            <button type='button' onClick={()=>setNewFilteredData(data)}>Reset</button>
          </div>
        </div>
       </div>
      </form>
      <div>
      {/* { filteredData?
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
        : */}
        <>
         <div>
          <input type="text" placeholder="Search by question" onChange={(e) => handleSearch(e.target.value)} style={{maxWidth:'300px',float:'right'}}/>
        </div>
        <table>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Product Type</th>
            <th>Data Steward</th>
            <th>Date</th>
            <th>Verified On</th>
            <th>Modify</th>
            {/* <th>Action</th> */}
          </tr>
          { newfilteredData &&
            newfilteredData?.map((item,index)=>(
              <tr key={index}>
                <td>{item.Question}</td>
                {/* <td>{extractQuarterYear(item)}</td> */}
                {/* <td dangerouslySetInnerHTML={{ __html: extractLatestQuarterYear(item) }} /> */}
                <td>{item.answer}</td>
                <td>{item.productType}</td>
                <td>{item.dataSteward}</td>
                <td>{item.date}</td>
                <td>{item.verifiedON}</td>
                <td><button onClick={()=>openPopUp(item)}>Modify</button></td>
              </tr>
            ))
          }
           { newfilteredData.length==0 && <tr><td colSpan={7}>No Data Found</td></tr>}
        </table>
        </>
        {/* } */}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Answer
          </Typography>
          <textarea value={popUpData?.UpdatedAnswer} onChange={(e)=>setPopUpData({...popUpData,UpdatedAnswer:e.target.value})} type='text' placeholder='Enter Answer' style={{width:'100%',height:'60px'}}/>
         <div className='text-center w-100'>
         <button onClick={handleClose}>Close</button>
          <button onClick={()=>modify()}>Modify</button>
         </div>
        </Box>
      </Modal>
   </div>
    </section>
    </>
  )
}

export default ModelData