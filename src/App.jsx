/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { Box } from "./components/Box";
import { Slot } from "./components/Slot";
import { useAppContext } from "./store";

const WARNING = 'warning'
const SUCCESS = 'success'
const DANGER = 'danger'


const Notification = ({ typeNoti, message }) => {
  if (!message) return null;
  const mapCss = {
    warning: 'notification warning',
    success: 'notification',
    danger: 'notification danger'
  }
  return (
    <div className={mapCss[typeNoti]}>
      <p>{message}</p>
    </div>
  );
};
function App() {
  const [dataRes, setDataRes] = useState()
  const [typeNoti, setTypeNoti] = useState()
  const [showNotification, setShowNotification] = useState(false)
  const [valueCorrect, setValueCorrect] = useState()
  const [message, setMessage] = useState('')
  const { inputValue, dropValue, setIsNotValidInput } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/public/data.json");
        const data = await response.json();

        setDataRes(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleShowNotification = (message, type) => {
    setTypeNoti(type)
    setMessage(message)
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const mapData = useMemo(() => {
    if (dataRes) {

      const textSplit = dataRes?.question?.paragraph?.split(" ")?.map(((x, index) => ({
        id: index,
        value: x
      })))

      const objectKey = {}

      const dataMapBaseOnBlanks = textSplit.filter(item => item?.value?.startsWith("[_input"))?.map((item, index) => {
        if (dataRes?.question?.blanks[index]) {
          const blanksData = dataRes?.question?.blanks[index]
          objectKey[item?.id] = index
          return {
            ...item,
            correctAnswer: blanksData?.correctAnswer,
            position: blanksData?.correctAnswer,
            type: blanksData?.type,
          }
        }
      })
      setValueCorrect(dataMapBaseOnBlanks)
      return textSplit.map((text, index) => {
        if (objectKey[text?.id] !== undefined) {
          return <Slot key={index} name={`input-${index}`} data={dataMapBaseOnBlanks[objectKey[text?.id]]} />
        }
        return <span className="text-span" key={index}>{text?.value}</span>
      }
      )
    }
  }, [dataRes])
  const handleSubmit = () => {

    if (!inputValue?.value) {
      handleShowNotification('Please field a value to input', WARNING)
    }
    else if (!dropValue?.value) {
      handleShowNotification('Please field a value to drag input', WARNING)
    }
    else {
      const conditionCorrect = valueCorrect?.some(x => x?.id === inputValue?.id && x?.correctAnswer === inputValue?.value) && valueCorrect?.some(x => x?.id === dropValue?.id && x?.correctAnswer === dropValue?.value)
      if (conditionCorrect) {
        handleShowNotification('Correct Answer!', SUCCESS)
      } else {
        setIsNotValidInput(true)
        handleShowNotification('Incorrect Answer!', DANGER)
      }

    }

  }
  return (
    <>
      <h1>[IELTS 1984] Online Test - Front End Developer</h1>
      <div className="App">
        <DndProvider backend={HTML5Backend}>
          <div className="slot-container" >
            {dataRes && mapData}
          </div>
          <div className="box-container">
            {dataRes?.question?.dragWords.map((item) =>
              <Box key={item?.id} name={item?.word} color={item?.color} />
            )}
          </div>
        </DndProvider>
        <button onClick={handleSubmit} className="button">Submit</button>
        {showNotification && (
          <Notification
            typeNoti={typeNoti}
            message={message}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;
