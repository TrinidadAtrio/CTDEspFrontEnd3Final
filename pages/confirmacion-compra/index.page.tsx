import { Box, Typography } from '@mui/material'
import BodySingle from 'dh-marvel/components/layouts/body/single/body-single'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const ConfirmationPage: NextPage = () => {

    const router = useRouter()

    const {comicName, comicImg, comicPrice} = router.query;

  return (
    <>
    <BodySingle title='Compra exitosa'>
        <Box>
           <Typography>Que disfrutes tu compra</Typography> 
        </Box>
        <Box>
            <Typography>{comicName}</Typography>
        </Box>
    </BodySingle>
    </>
  )
}

export default ConfirmationPage