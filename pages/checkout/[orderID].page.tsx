import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "dh-marvel/components/layouts/body/single/body-single";
import TextField from '@mui/material/TextField';
import { Box, Typography, type SxProps, Stepper, Step, StepButton, StepLabel, Button, Paper, Grid, Collapse, Snackbar, Alert, Card, CardMedia, CardContent } from '@mui/material';
import { useState } from 'react';
import style from '../../styles/commons.module.css';
import { useForm } from 'react-hook-form';
import { CheckoutInput } from 'dh-marvel/features/checkout/checkout.types';
import { GetStaticProps } from 'next';
import { getComic } from 'dh-marvel/services/marvel/marvel.service';
import LayoutCheckout from 'dh-marvel/components/layouts/layout-checkout';
import { useRouter } from 'next/router';
import { Cookies } from 'next/dist/server/web/spec-extension/cookies';
import { rest } from 'msw';

const checkoutURL = (() => {
  const domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://vercel.com/';
  const url = new URL('/api/checkout', domain)
  return url.href;
})();

const checkoutSteps = ['Datos personales', 'Entrega', 'Pago'];

interface ApiErrorResponse {
  error: string;
  message: string;
}

const CheckoutPage: NextPage = ({ order }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [response, setResponse] = useState<ApiErrorResponse>();
  const { register, handleSubmit, formState: { errors }, watch, trigger, clearErrors } = useForm<CheckoutInput>();
  

interface CheckoutPageProps {
  order: {
    name: string;
    price: number;
    image: string;
  }
}

const CheckoutPage: NextPage<CheckoutPageProps> = ({ order }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState<ApiErrorResponse>();
  const { register, handleSubmit, formState, trigger, clearErrors } = useForm<CheckoutInput>();
  const { errors } = formState;

  const handleNextStep = async () => {
    const valitationsPerStep = {
      0: ['customer.name', 'customer.lastname', 'customer.email'],
      1: ['customer.address'],
      2: ['card'],
    }[activeStep]!
    const isValidFields = await trigger(valitationsPerStep as Array<keyof CheckoutInput>);
    if (isValidFields && activeStep < checkoutSteps.length - 1) {
      clearErrors();
      setActiveStep((step) => step + 1);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep((step) => step - 1);
    }
  };

  const onSubmit = async (result: any) => {
    try {
      const body = JSON.stringify({ ...result, ...order})
      const res = await fetch(checkoutURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      const response = await res.json()
      if (res.ok) {
        window.location.assign('http://localhost:3000/checkout/success');
      } else {
        const error = await res.json();
        setResponse(error);
      }
    } catch (err) {
      console.log(err);
    }

  }

    return (
        <>
          <Head>
              <title>Checkout</title>
              <link rel="icon" href="/favicon.ico"/>
          </Head>
          <Grid container spacing="20" justifyContent="center">
            <Grid item xs={6}>
              <Card>
                <CardContent style={{padding: '40px'}}>
                  <Stepper activeStep={activeStep}>
                    {checkoutSteps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <form onSubmit={handleSubmit(onSubmit)} style={{marginTop: '20px'}}>
                    <Collapse in={activeStep === 0}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Nombre"
                            {...register('customer.name', { required: true })}
                            error={Boolean(errors.customer?.name)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Apellido"
                          {...register('customer.lastname', { required: true })}
                            error={Boolean(errors.customer?.lastname)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Email"
                            {...register('customer.email',
                              { required: true,
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: "Email inválido" }
                              })
                            }
                            error={Boolean(errors.customer?.email)}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>
                    <Collapse in={activeStep === 1}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Dirección" {...register('customer.address.address1', { required: 'Este campo es obligatorio' })}
                            error={Boolean(errors.customer?.address?.address1)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Departamento, piso, etc" {...register('customer.address.address2')} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Ciudad"
                            {...register('customer.address.city', { required: 'Este campo es obligatorio' })}
                            error={Boolean(errors.customer?.address?.city)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Provincia"
                          {...register('customer.address.state', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.customer?.address?.state)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Código Postal"
                          {...register('customer.address.zipCode', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.customer?.address?.zipCode)} />
                        </Grid>
                      </Grid>
                    </Collapse>

                    <Collapse in={activeStep === 2}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Número de Tarjeta"
                          {...register('card.number', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.card?.number)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Nombre en la Tarjeta"
                          {...register('card.nameOnCard', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.card?.nameOnCard)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" label="Fecha de Expiración"
                          {...register('card.expDate', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.card?.expDate)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth variant="outlined" type="password" label="Código de Seguridad"
                          {...register('card.cvc', { required: 'Este campo es obligatorio' })}
                          error={Boolean(errors.card?.cvc)} />
                        </Grid>
                      </Grid>
                    </Collapse>
                    <div style={{marginTop: '20px',display: 'flex', justifyContent: 'space-between'}}>
                      <Button variant="contained" color="secondary" onClick={handleBackStep} disabled={activeStep === 0}>
                        Anterior
                      </Button>
                      {activeStep !== 2 && <Button variant="contained" color="primary" onClick={handleNextStep} disabled={activeStep === 2}>
                        Siguiente
                      </Button>}
                      { (activeStep === checkoutSteps.length - 1) && (
                          <Button variant="contained" color="primary" type="submit">
                            Enviar
                          </Button>
                        )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardMedia
                  component="img"
                  alt={order.name}
                  height="140"
                  image={order.image}
                  title={order.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{order.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio: ${order.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Snackbar open={!!(response?.error)}>
            <Alert severity="error" variant="filled">
              {response?.message}
            </Alert>
          </Snackbar>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const comicId = parseInt(context.params!.orderID as string);
  const comic = await getComic(comicId);
  const image = comic.images[0];

  return {
    props: {
      order: {
        name: comic.title,
        image: `${image.path}.${image.extension}`,
        price: comic.price,
      }
    },
  };
};

(CheckoutPage as any).Layout = LayoutCheckout

export default CheckoutPage
