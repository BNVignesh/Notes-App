import React from 'react'
import moment from 'moment'
import {MdCreate, MdDelete, MdOutlinePushPin} from "react-icons/md";
const NoteCard = ({title,date,content,tags,isPinned,onEdit,onDelete,onPinNote}) => {
  return (
    <div className=' m-auto  border rounded p-4 bg-white hover:shadow-xl transistion-all ease-in-out w-full'>
        <div className='flex items-center justify-between'>
            <div>
                <h6 className='text-sm font-medium'>{title}</h6>
                <span className='text-xs text-slate-500'>{moment(date).format('Do MMM YYYY')}</span>
            </div>
            <MdOutlinePushPin className={`icons-btn ${isPinned ? 'text-primary':'text-slate-300'}`} onClick={onPinNote}/>
        </div>
        <p className='text-xl text-slate-500 mt-2'>{content?.slice(0,60)}</p>
        <div className='flex items-center justify-between mt-3'>
          <div className='text-xs text-slate-500'>{tags.map((item)=>{return(`${item}`)})}</div>
          <div className='flex items-center gap-2'>
            <MdCreate
              className='icon-btn hover:text-green-600'
              onClick={onEdit}
            />
            <MdDelete className='icon-btn hover:text-red-500'
              onClick={onDelete}
            />
          </div>
        </div>
    </div>
  )
}

export default NoteCard
