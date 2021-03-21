import React from 'react'
import PetTab from './PetTab'

const PetTabs = ({ pets }) => {
  return pets.map(pet => (
    <PetTab key={pet.id} pet={pet}></PetTab>
  ))
}

export default PetTabs
