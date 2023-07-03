import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Main = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
const [difficulty, setDifficulty] = useState('select');

  useEffect(() => {
    const data= JSON.parse(localStorage.getItem('token'));
    console.log(data);
    const user = data.user.username
    console.log(user);
    setName(user)
    if(!data){
    navigate("/auth")
    }
    console.log(data,"check");
    
  
    
  }, [])

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setDifficulty(selectedDifficulty);
    localStorage.setItem('difficulty', selectedDifficulty);
  };
  

    
  return (
    <div className="flex justify-center items-center bg-gray-900 h-screen">
    <div className="flex flex-col gap-5 bg-gray-200  rounded-2xl p-10 w-[500px] text-center text-white">

      <h1 className="text-4xl text-gray-900 font-bold">Quiz App</h1>
      <p className="text-2xl text-gray-600 font-bold">Hello {name}</p>
      <p className="text-xl text-gray-600">Test Your Brain....</p>
      <div className='my-5'>
            
            <select
              id='difficulty'
              className=' bg-gray-600 text-gray-200 text-md px-10 rounded-lg py-2  ml-2 focus:outline-none'
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="select" >Select Difficulty</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
          </div>

      <button type="button" onClick={()=>navigate("/questions")} className=" text-2xl text-white  bg-gray-700 hover:bg-gray-900  font-medium rounded-lg  py-2.5 text-center mr-2 mb-2">Let's Start</button>
    </div>
  </div>
  
  )
}

export default Main