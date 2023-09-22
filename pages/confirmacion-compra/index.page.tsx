import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import BodySingle from 'dh-marvel/components/layouts/body/single/body-single'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const ConfirmationPage: NextPage = () => {
    const router = useRouter();
    const {productName, img, orderPrice, address, name} = router.query;

  return (
    <>
    <BodySingle title='Que disfrutes tu compra'>
      <Grid container>
        <Grid item xs={4}>
          <Card>
            <CardMedia
              component="img"
              alt={productName as string}
              height="140"
              image={img as string}
              title={productName as string}
            />
            <CardContent>
              <Typography variant="h5">{productName}</Typography>
              <Typography variant="h6">Comprador: {name}</Typography>
              <Typography variant="h6">Envio a: {address}</Typography>
              <Typography variant="body2" color="text.secondary">
                Monto abonado: ${orderPrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BodySingle>
    </>
  )
}

export default ConfirmationPage