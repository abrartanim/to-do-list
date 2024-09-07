import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import TaskAbi from '../../backend/build/contracts/TaskContract.json'
import { useState } from 'react'
import { TaskContractAddress } from '../config.js'
import { Input } from 'postcss'
import { ethers } from 'ethers'


/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  //state variables
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [input, setInput] = useState('')



  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log("Metamask not detected")
        return
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain ', chainId)

      const sepoliaChainId = '0xaa36a7'
      if (chainId != sepoliaChainId) {
        alert("You are not connected to the Sepolia Test Network")
        setCorrectNetwork(false)
        return
      }
      else {
        setCorrectNetwork(true)

      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected to account ', accounts[0])
      setIsUserLoggedIn(true)
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }

  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {

  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {
    console.log("Working")
    e.preventDefault() //avoid refreshing the page

    let task = {
      taskText: Input,
      isDeleted: false
    }

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer)

        TaskContract.addTask(task.taskText, task.isDeleted).then(res => {
          setTasks([...tasks, task])
          console.log('Added task to blockchain')
        })
          .catch(err => {
            console.log(err)
          })

      }
      else {
        console.log('Ethereum object does not exist')
      }

    } catch (error) {
      console.log(error)
    }

  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {

  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton connectWallet={connectWallet} /> :
        correctNetwork ? <TodoList input={input} setInput={setInput} addTask={addTask} /> : <WrongNetworkMessage />}
    </div>
  )
}

