import React from 'react'
import { Personaje } from 'interfaces/character';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Avatar, Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import { getCharacter } from 'dh-marvel/services/marvel/marvel.service'
import BodySingle from 'dh-marvel/components/layouts/body/single/body-single'
import Head from 'next/head'

interface Props{
    character: Personaje
}

const PersonajePage: NextPage<Props> = ({character}) => {

  return (
    <>
    <Head>
      <title>{character.name}</title>
      <meta name="description" content={character.name}/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
      
    <BodySingle title='Detalle del Personaje seleccionado'>
      <Card sx={{ display: 'flex', height: '500px', marginTop: '3rem', width:'70%', alignSelf: 'center' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" color='#1976d2'>
            {character.name}
          </Typography>
          {character.description 
          ? 
          <Typography>
            {character.description}
          </Typography>
          : ""
          }
        </CardContent>
        <CardMedia
          component="img"
          sx={{ height: 'auto', width: '70%' }}
          image={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt="Foto del personaje"
        />
      </Card>
    </BodySingle>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) =>{
    
    const characterId = Number(context.params?.id);
    const character = await getCharacter(characterId);

    return {
        props: {
            character,
        }
    }

}

export default PersonajePage