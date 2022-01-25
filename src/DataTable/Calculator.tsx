import React, { useState,useEffect }  from 'react';
import styled from 'styled-components';

 type CalculatorProps = {
  sortedData: any[]
}

type History = {
  sums: string[]
  prevSum : string
}

function Calculator({ sortedData }: CalculatorProps) {
  const [result, setResult] = useState('')
  const [sum, setSum] = useState({ visual: '', actual: '' })
  const [history, setHistory] = useState<History>({sums:[], prevSum: ''})
  const [type, setType] = useState('text')
  const [entry, setEntry] = useState('')
  const [currentRow,setCurrentRow] = useState('')

  const operators = ['+', '-', '*', '/']
  let headers:any[] = []
  Object.keys(sortedData[0]).forEach(key => headers.push(key))

  const onSum = (value: string,eventData: string) => {
    if(result) return setResult('')
    if ((type=== 'text' || type === 'key') && operators.includes(eventData)) return alert(`enter ${type === 'text' ? 'value' : 'key'} to unlock operators`)
    if(type === 'operator' && !operators.includes(value) ) return alert('enter operator (+ - * /) to unlock values')
    setEntry(value)
  }

  const setCellValue = (entry: number) => {
    let cell
    try {
       cell = sortedData[entry - 1][currentRow]
    } catch (error) {
        return alert('cell not found')
    }
    const cellValue = (typeof cell === 'number' ? cell.toString() : cell.length.toString())
    setSum({ visual: sum.visual +' '+ entry, actual: sum.actual + cellValue })
    setCurrentRow('')
    onTypeSet('operator')
  }

  const onTypeSet = (type: string) => {
    setEntry('')
    setType(type)
  }

  const setValue = () => {
    if (headers.includes(entry)) {
      setCurrentRow(entry)
      setSum({ ...sum, visual: sum.visual + ' ' + entry })
      onTypeSet('key')
    }

    const numEntry = entry.replace(/\D/g, '')
    if ( numEntry.length) {
      if (type === 'key') {
        setCellValue(parseInt(entry))
      }
      else {
        sum.actual = sum.actual + numEntry
        setSum({ ...sum, visual: sum.visual + ' '+ numEntry })
        onTypeSet('operator')
      }
    }
  }

  useEffect(() => {
    if (operators.includes(entry) && type === 'operator') {
      setEntry('')
      setType('text')
      setSum({ visual: sum.visual + ' '+ entry,  actual: sum.actual + entry.toString()})
    }
  }, [entry])

  const calculate = () => {
    const result = eval(sum.actual)
    const currentSum = history.prevSum ? history.prevSum + sum.actual : sum.actual
    setResult(result)
    setHistory({ sums:[...history.sums, currentSum + '=' + result] ,prevSum: currentSum + '=' + result})
    sum.actual = ''
  }

  const reset = () => {
    setType('text')
    setEntry('')
    setSum({ visual: '', actual: '' })
    history.prevSum = ''
    setResult('')
  }

  return (
    <CalculatorContainer >
      <VisualSum>{sum.visual}</VisualSum>
      <ColumnContainer>
        <input style={{width:'65%'}} onKeyPress={(e) => e.key === 'Enter' ? setValue() : () => { } } value={entry || result} onChange={(e) => onSum(e.target.value,e.nativeEvent.data)} type={type === 'key' ? 'number':'text'} />
        <SumHistory>
          {sum.actual}
          {history.sums.map((item, index) => <div key={index}>{item}<hr/></div>)}
        </SumHistory>
      </ColumnContainer>
      {/* <div>Set {type === 'text' ? 'Column name' : type === 'number' ? 'Row num' : 'Operator'}</div> */}
      {sum.actual && <button onClick={calculate}>Calculate</button>}
      <button onClick={reset}>Reset</button>
    </CalculatorContainer>
  );
}

const CalculatorContainer = styled.div`
	${({ theme }) => theme.calculator.style}
`;

const VisualSum = styled.span`
  font-size:12px;
  position:absolute;
  margin-left: 2px;
  text-decoration: underline;
`;

const SumHistory = styled.div`
  font-size:12px;
  width:30%;
  height: 60px;
  border:1px solid black;
  overflow: scroll;
  `
const ColumnContainer = styled.div`
  display:flex;
  flex-direction:row;
  `

export default Calculator;