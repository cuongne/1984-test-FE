/* eslint-disable react/prop-types */
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../ItemTypes'
import './styles.css'
import { useState } from 'react'
import { useAppContext } from '../store';

const InputValue = ({data}) => {
  const [value, setValue] = useState('');
  const { setInputValue,isNotValidInput,setIsNotValidInput } = useAppContext();

  const handleChange = (e) => {
    const input = e.target.value;
    setIsNotValidInput(false)
    setInputValue({value: input,id:data?.id});
    setValue(input);

  };

  return (
    <input
      value={value}
      onChange={handleChange}
      className={`custom-input ${isNotValidInput && 'alert'}`}
    />
  );
};

const DragInput = ({  data }) => {
  const {  setDropValue } = useAppContext();
  const [value, setValue] = useState('')
  const [termValue, setTermValue] = useState('')
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item) => {
      if (item?.name === data?.correctAnswer){
        setValue(item?.name)
        setDropValue( {value:item?.name,id:data?.id});

      }
      return data
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item) => {
      setTermValue(item?.name);
      return item
    },
  }))
  const isActive = canDrop && isOver && termValue
  if (value) {
  return  <div className='slot'>
      <span  >
        {value}
      </span>
    </div>
  }
  return (
    <div ref={drop} data-testid="dustbin" className='slot'>
      <span>
        {isActive ? termValue : ''}
        {value || ''}
      </span>
    </div>
  )
}

export const Slot = ({ data }) => {

  if (data?.type === 'input') {
    return <InputValue data={data} />
  }
  return (
    <DragInput data={data} />
  )
}
