import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

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
let basePath="https://llmusecases.aeriestechnology.com/isqapi/"
function Data() {
    let [data,setData]=useState([])
    const loadData=()=>{
      fetch(basePath+"get_initial_data")
      .then((response) => response.json())
      .then((res) => {
          setData(res)
          setFilteredData(res)
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
      setPopUpData(val)
    }
    
    const modify=()=>{
      console.log(popUpData)
      const today = new Date();
      const month = today.getMonth() + 1;

      const quarter = Math.ceil(month / 3);
      const year = today.getFullYear();
        const parm = {
          "Question": popUpData.Questions,
          "quarter": `Q${quarter}`.toString(),
          "year": year.toString(),
          "Answer":popUpData.UpdatedAnswer
        };
        const requestOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parm)
        };
        
        fetch("http://127.0.0.1:5000/modifyold", requestOptions)
          .then((response) => response.json())
          .then((res) => {
            const updatedData = data.map(item => 
              item.Questions === popUpData.Questions ? { ...item, isAccepted: true } : item
            );
            setData(updatedData);
            handleClose()
            loadData()
            alert('Answer Modified')
          })
          .catch((error) => console.error(error));
          handleClose() 
    }

    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = (searchTerm) => {
      const filtered = data.filter(item =>
        item?.Questions.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    };
    
  return (
    <>
    <Header/>
   <div className='global_flex'>
   <SideMenu/>
   <div className='data_table'>
   <div>
      <input type="text" placeholder="Search by question" onChange={(e) => handleSearch(e.target.value)} style={{marginTop:'2rem',marginBottom:'0'}}/>
    </div>
    <table>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Verified On</th>
            <th>Modify</th>
          </tr>
          {
            filteredData?.map((item,index)=>(
              <tr key={index}>
                <td>{item?.Questions}</td>
                <td>{item?.Answer}</td>
                <td>{item['Verification Date']?.slice(0,10)}</td>
                <td><button onClick={()=>openPopUp(item)}>Modify</button></td>
              </tr>
            ))
          }
      </table>
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
          <button onClick={handleClose}>Close</button>
          <button onClick={()=>modify()}>Modify</button>
        </Box>
      </Modal>
   </div>
   </div>
    </>
  )
}

export default Data