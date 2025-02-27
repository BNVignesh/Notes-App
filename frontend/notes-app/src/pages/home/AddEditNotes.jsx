import React, { useState } from 'react'
import TagInputs from '../../components/Inputs/TagInputs'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosinstance';

const AddEditNotes = ({noteData={},type,onClose,getAllNotes,showToastMessage}) => {

    const [title,setTitle]=useState(noteData?.title||"");
    const [content,setContent]=useState(noteData?.content||"");
    const [tags,setTags]=useState(noteData?.tags||[]);
    const [error,setError]=useState(null);

    const editNote=async ()=>{
        const noteId=noteData._id;
        //console.log(noteId);
        try{
            const response=await axiosInstance.put('/edit-note/'+noteId,{
                title,
                content,
                tags
            })
            if(response.data && response.data.note){
                showToastMessage("Note updated Successfully")
                getAllNotes();
                onClose()
            }
        }catch(error){
            if(error.response && error.response.data && error.response.message){
                setError(error.response.data.message);
            }
        }
    };
    const addNewNote=async ()=>{
        try{
            const response=await axiosInstance.post('/add-note',{
                title,
                content,
                tags
            })
            if(response.data && response.data.note){
                showToastMessage("Note Added successfully")
                getAllNotes();
                onClose()
            }
        }catch(error){
            if(error.response && error.response.data && error.response.message){
                setError(error.response.data.message);
            }
        }
    };

   
    const handleAddNote=()=>{
        if(!title){
            setError("please enter title");
            return;
        }
        if(!content){
            setError("please enter content");
            return;
        }
        console.log(error);
        
        setError("");
        if(type=== 'edit'){
            editNote();
        }else{
            addNewNote();
        }
    }
  return (
    <div className='relative'>
        <button className='w-10 h-10 rounded-full items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' > 
            <MdClose className='text-xl text-slate-400' onClick={onClose}/>
        </button>
        <div className='flex flex-col gap-2'>
            <label className='input-label'>TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none'
                placeholder='go to gym at 5'
                value={title}
                onChange={({target})=>{setTitle(target.value)}}
            />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>CONTENT</label>
            <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Content' 
                value={content}
                onChange={({target})=>{setContent(target.value)}}
            rows={10}/>
        </div>
        <div className='mt-3'>
            <label className='input-label'>TAGS</label>
            <TagInputs tags={tags} setTags={setTags}/>
        </div>

        {error && <p className='text-xs text-red-600 pt-4'>{error}</p>}
        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{type ==='edit' ? 'UPDATE':'ADD'}</button>
    </div>
  )
}

export default AddEditNotes
