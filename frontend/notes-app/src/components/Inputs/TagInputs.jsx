import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInputs = ({ tags, setTags }) => {
    const [inputvalue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        //console.log(inputvalue);
    }
    const addNewTag = () => {
        //console.log("iam running");
        if (inputvalue.trim() !== "") {
            setTags([...tags, inputvalue.trim()]);
        }
        setInputValue("");
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    }
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => { tag !== tagToRemove }))
    }
    return (
        <div>
            {tags?.length > 0 && (
                <div className='flex items-center gap-2 flex-wrap mt-2'>
                    {tags.map((tag, index) => {
                        return (
                            <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded'>
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)}>
                                    <MdClose />
                                </button>
                            </span>
                        )
                    })}
                </div>
            )}
            <div className='flex items-center gap-4 mt-3'>
                <input type="text" className='text-sm bg-transparent border px-3 py-2 rounded outline-none' value={inputvalue} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                <button className='w-8 h-8 flex items-center justify-center rounded border-blue-700 hover:bg-blue-700 ' onClick={addNewTag}>
                    <MdAdd className='text-2xl text-blue-700 hover:text-white' />
                </button>
            </div>

        </div>
    )
}

export default TagInputs
