import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import NoteCard from '../../components/cards/NoteCard'
import { MdAdd, MdOutlineAlarmAdd } from 'react-icons/md'

import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useAsyncError, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import Toast from '../../components/ToastMessages/Toast.jsx';
import EmptyCard from '../../components/EmptyCard/EmptyCard.jsx';



const Home = () => {
  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: 'add',
    data: null
  });

const [showToastMsg,setShowToastMsg]=useState({
  isShown:false,
  type:"add",
  data:null
});

  const [userInfo, setUserInfo] = useState(null);
  const[allNotes,setAllNotes]=useState([]);

  const navigate = useNavigate();

const [isSearch,setIsSearch]=useState(false);
  const handleEdit=(noteDetails)=>{
    setOpenAddEditModel({isShown:true, data:noteDetails,type:"edit"})
  }

  const showToastMessage=(message,type)=>{
    setShowToastMsg({
      isShown:true,
      message,
      type
    })
  }
const handleCloaseToast=()=>{
  setShowToastMsg({
    isShown:false,
    message:""
  })
}
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      console.log(response);
      if (response.data && response.data.notes){
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log("an unexpcted error occured");
    }
    
  }
  const deleteNote=async (data)=>{
    console.log(data);
    const noteId=data._id;
    //console.log(noteId);
    try{
        const response=await axiosInstance.delete("/delete-note/"+noteId)
        if(response.data && !response.data.error){
            showToastMessage("Note deleted Successfully",'delete')
            getAllNotes();
           
        }
    }catch(error){
        if(error.response && error.response.data && error.response.message){
           console.log("an unexpected error occurred . Please try again")
        }
    }
  }
  const onSearchNote=async(query)=>{
    try{
      const response=await axiosInstance.get("/search-notes",{
        params:{query}
      })
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error);
    }
  }
  //console.log(allNotes);
  
  const handleClearSearch=()=>{
    setIsSearch(false);
    getAllNotes();
  }
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { }
  }, []);
  return (
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className='container mx-auto '>
        {allNotes.length>0?<div className='grid grid-cols-3 gap-4 mt-8 w-full'>
          {allNotes.map((item,index)=>{
          return(
            <NoteCard 
            key={item._id}
            title={item.title} 
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned} 
            onEdit={() => {handleEdit(item) }} 
            onDelete={() => deleteNote(item)} 
            onPinNote={() => { }} 
          />
          )
            
          })}
        
        </div>:<EmptyCard/>}

      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-3' onClick={() => { setOpenAddEditModel({ isShown: true, type: 'add', data: null }) }}>
        <MdAdd className='text-[32px] text-white' />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      ><AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => { setOpenAddEditModel({ isShown: false, type: "add", data: null }) }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg}
          onClose={handleCloaseToast}
        />
    </div>
  )
}

export default Home
