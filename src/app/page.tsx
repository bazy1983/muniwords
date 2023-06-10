'use client';

import { Button, Card, FormElement, Input, Spacer } from '@nextui-org/react';
import React, { ChangeEvent, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
interface IFormData {
  name: string;
  guess: string
}



const startTime = new Date("june 10 2023 12:00 CST").toLocaleString('en-GB', { timeZone: 'GMT' });
const endTime = new Date('june 11 2023 15:45 CST').toLocaleString('en-GB', { timeZone: 'GMT' });


const LandingPage = () => {
  const currentDate = new Date();
  const currentDateTimeGMT = currentDate.toLocaleString('en-GB', { timeZone: 'GMT' });

  const isDisabled = React.useMemo(()=>{
    if(currentDateTimeGMT < startTime) toast.error('Game will start soon!');
    if(endTime < currentDateTimeGMT) toast.error('Game Ended!');
    return !(startTime <= currentDateTimeGMT && currentDateTimeGMT <= endTime)
  }, [currentDateTimeGMT])

  const [formData, setFormData] = React.useState<IFormData>({name: '', guess: ''})
  const [count, setCount] = React.useState<number>(0)
  const nameRef = React.useRef<HTMLInputElement>(null);
  const answerRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(()=>{
    if(!formData.guess){
      fetch('/api/query?' + new URLSearchParams({get: 'count'}))
      .then(resp => resp.json())
      .then(data => {
        console.log(data[0].count)
        setCount(data[0].count || 0)
      })
    }
  }, [formData.guess])

  const onsubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(!formData.name){
      toast.error('Oops! you must forgot to enter your name!');
      nameRef.current?.focus()
      return;
    }
    if(!formData.guess){
      toast.error('hmm, we can\'t win without an answer!')
      answerRef.current?.focus()
      return;
    }
    const resp = await fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const data = await resp.json()
    // console.log(data)
    if(data[0].message === 'ok'){
      toast.success('Nicely done!')
      setFormData(state => ({...state, guess: ''}))
      answerRef.current?.focus()
    } else {
      toast.error('can\'t do! answer already taken!')
    }
  };

  const inputChangeHandler = (e: ChangeEvent<FormElement>) => {
    const prop = e.target.name;
    const value = e.target.value;
    setFormData(currentState => {
      return {...currentState, [prop]: value}
    })
  }

  return (
    <>
      <header><h2>Muniwords Game</h2></header>
      <div className="landing-page">
        <div className="left">
          <img src="diamond-painting-4.jpg" alt="Your Image" style={{width: '100%'}}/>
        </div>
        <div className="right">
          <Card>
            <Card.Body>
              <div style={{width: '95%'}}>
                <h4>Rules</h4>
                <ul>
                  <li>Please type in your name as it appears on your Facebook account.</li>
                  <li>In the answer field, type in a Munimade term. It could be a one-word term like &quot;tray&quot; or a multi-word term like &quot;color-changing tray.&quot;</li>
                  <li>If the answer has already been used, you will receive a rejection notice.</li>
                  <li>Any answer that is not Munimade-related will be disqualified, even if it is successfully submitted.</li>
                  <li>To win the game, your record must be the last qualified record taken in the database.</li>
                  <li>Number of records currently is {count}</li>
                </ul>

              </div>
              <form onSubmit={onsubmit}>
                <Input 
                  ref={nameRef}  
                  type="text" 
                  label='Your Facebook Name' 
                  size='lg' 
                  placeholder="Name" 
                  value={formData.name} 
                  name='name' 
                  status='primary'
                  disabled={isDisabled}
                  onChange={inputChangeHandler}/>
                  
                <Spacer y={0.3}/>
                <Input 
                  ref={answerRef} 
                  type="text" 
                  label='Your Answer'size='lg' 
                  placeholder="Answer" 
                  name='guess' 
                  value={formData.guess} 
                  status='primary'
                  disabled={isDisabled}
                  onChange={inputChangeHandler}/>
                <Spacer y={0.3}/>
                <div style={{display: 'flex', width: '90%', justifyContent: 'flex-end'}}>
                  <Button type="submit">Submit</Button>

                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default LandingPage;
