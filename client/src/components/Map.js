import React,{useEffect,useState,useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from './PinIcon'
import Blog from './Blog'
import Context from '../context'
import { useClient } from '../client'
import ReactMapGL,{NavigationControl,Marker,Popup} from 'react-map-gl'
import { GET_PINS_QUERY } from '../graphql/queries'
import differenceInMinutes from 'date-fns/difference_in_minutes'
import { DELETE_PIN_MUTATION } from '../graphql/mutations'

import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'


import { Subscription } from 'react-apollo'

import { PIN_ADDED_SUBSCRIPTION,PIN_UPDATED_SUBSCRIPTION,PIN_DELETED_SUBSCRIPTION  } from '../graphql/subscriptions'


const INITIAL_VIEWPORT={
  latitude:28.635955199999998,
  longitude:77.2308992,
  zoom:13
}


const Map = ({ classes }) => {
  const client=useClient()
 
  const mobileSize = useMediaQuery('(max-width: 650px )')



  const getPins = async ()=>{
    const { getPins } = await client.request(GET_PINS_QUERY)

    dispatch({ type:'GET_PINS',payload:getPins })

  }
  



useEffect(()=>{
  getPins()
})

const { state,dispatch } =useContext(Context)
const [lat,setLat]=useState(INITIAL_VIEWPORT.lat)
const [lng,setLng]=useState(INITIAL_VIEWPORT.lng)
const [viewport,setViewport] = useState(INITIAL_VIEWPORT)
const [userPosition,setUserPosition] = useState(null)

useEffect(()=>{
  getUserPosition()
},[])

const [ popup,setPopup ] =useState(null)




const isAuthUser=()=>state.currentUser._id === popup.author._id



const handleMapClick=({ lngLat,leftButton })=>{

  if(!leftButton) return 

  if(!state.draft){
    dispatch({type:"CREATE_DRAFT"})
  }
 
  const [longitude,latitude] = lngLat

console.log(lngLat)


  dispatch({
    type:"UPDATE_DRAFT_LOCATION",
    payload:{
      longitude,
      latitude
    }
  })

}


const getUserPosition=()=>{
  if("geolocation" in navigator ){
    navigator.geolocation.getCurrentPosition(position=>{
      const {latitude,longitude} = position.coords
      setViewport({...viewport,latitude,longitude})
      setUserPosition({latitude,longitude})
    })
  }
}



const higlightNewPin=pin=>{

 const isNewPin = differenceInMinutes( Date.now(),Number(pin.createdAt) ) <=30

 return isNewPin ?  "limegreen":"darkblue"

}


const handleSelectPin =pin=>{
  setPopup(pin)
  dispatch({type:"SET_PIN",payload:pin})
}

const handleDeletePin= 
async pin=>{
     
  const variables={ pinId: pin._id  }
  // const { deletePin } = 
 await client.request(DELETE_PIN_MUTATION,variables)

  // dispatch({ type:"DELETE_PIN",payload:deletePin })

  setPopup(null)


}


  return (
    <div className={mobileSize?classes.rootMobile:classes.root}>
      <ReactMapGL
        width="100vw"
        scrollZoom={!mobileSize}
        onClick={handleMapClick}
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1Ijoic2FpYXNoaXNoIiwiYSI6ImNrMDk5eGlubDA2M2wzY3BpeTN4cGl3NzYifQ.LElgS4BDmCfoQ5gcGPFTyg"
        onViewportChange={
          newViewport =>setViewport(newViewport)
        }
        {...viewport}
      >

     <div className={classes.navigationControl}>
     <NavigationControl
             onViewportChange={
              newViewport =>setViewport(newViewport)
            }
     />
     </div>
 
{
  userPosition && (
    <Marker
    latitude={userPosition.latitude}
    longitude={userPosition.longitude}
    offsetLeft={-19}
    offsetTop={-37}
>
  <PinIcon 
  onClick={
    () => handleSelectPin(userPosition)
  }
  size={40} 
  color="red" />
</Marker>
  )
}


{
  state.draft && (
    <Marker
    latitude={state.draft.latitude}
    longitude={state.draft.longitude}
    offsetLeft={-19}
    offsetTop={-37}
>
  <PinIcon

  size={40} color="hotpink" />
</Marker>
  )
}


{
  state.pins.map(pin=>(
    <Marker
    key={pin._id}
    latitude={pin.latitude}
    longitude={pin.longitude}
    offsetLeft={-19}
    offsetTop={-37}
>

  <PinIcon 
  onClick={()=>handleSelectPin(pin)}
  size={40} 
  color={higlightNewPin(pin)} 
  />

</Marker>    
  ))
}

{
  popup && (
    <Popup
    anchor="top"
    latitude={popup.latitude}
    longitude={popup.longitude}
    closeOnClick={false}
    onClose={()=>setPopup(null)}
    >

<img
className={classes.popupImage}
src={popup.image}
alt={popup.title}
/>


<div className={classes.popupTab} >

<Typography>

  {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}


</Typography>


{
  isAuthUser()&&(
    <Button onClick={()=> handleDeletePin(popup) } >
      <DeleteIcon className={classes.deleteIcon} />
    </Button>
  )
}


</div>

    </Popup>
  )
}


      </ReactMapGL>
 

<Subscription
subscription={PIN_ADDED_SUBSCRIPTION}
onSubscriptionData={({subscriptionData})=>{
  const {pinAdded}=  subscriptionData.data
console.log({pinAdded})
 dispatch({type:'CREATE_PIN',payload:pinAdded})

}}
/>

<Subscription
subscription={PIN_UPDATED_SUBSCRIPTION}
onSubscriptionData={({subscriptionData})=>{
  const {pinUpdated}=  subscriptionData.data
console.log({pinUpdated})
 dispatch({type:'CREATE_COMMENT',payload:pinUpdated})

}}
/>

<Subscription
subscription={PIN_DELETED_SUBSCRIPTION}
onSubscriptionData={({subscriptionData})=>{
  const {pinDeleted}=  subscriptionData.data
console.log({pinDeleted})
 dispatch({type:'DELETE_PIN',payload:pinDeleted})

}}
/>

 
 <Blog/>
 
 
    </div>
  )
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
