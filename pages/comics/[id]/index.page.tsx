import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getComic, getComics } from 'dh-marvel/services/marvel/marvel.service';
import { Comic, ComicIndividual } from 'interfaces/comics';
import { Box, Card, CardContent, CardMedia, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Head from 'next/head';
import BodySingle from 'dh-marvel/components/layouts/body/single/body-single';
import { useRouter } from 'next/router';

interface Props{
  comic: ComicIndividual
}

const ComicPage: NextPage<Props> = ({comic}) => {

  const router = useRouter();

  const getIdCaharacter = (url: string) =>{
      return url.slice((url.lastIndexOf('/'))+1)
  }

  const handleSelectCharacter = (url: string) =>{
    const id = getIdCaharacter(url)
    router.push(`/personajes/${id}`);
  };

  const handleClickBuy = (comicId: number) => {
    router.push(`/checkout/${comicId}`)
  }

  return (
    < >
      <Head>
        <title>{comic.title}</title>
        <meta name="description" content={comic.title}/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <BodySingle title='Detalle del Comic seleccionado'>
        <Card sx={{ display: 'flex', height: '500px', marginTop: '3rem', width:'70%', alignSelf: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100', width: '70%' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5" color='#1976d2'>
                {comic.title}
              </Typography>
              {comic.description === null || comic.description === "" 
              ? ""
              : <Typography gutterBottom component="div" color="text.secondary" marginTop="1rem">{comic.description}</Typography>
              }
              <Box sx={{marginTop: '1rem'}}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight='600' component="div">
                  Antes: ${comic.oldPrice}
                </Typography>
                <Typography variant="h6" component="div" color="#1976d2" fontWeight='600'>
                  Ahora: ${comic.price}
                </Typography>
              </Box>
              <Box sx={{margin: '1rem'}}>
                {comic.characters.items.length > 0
                ? <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Personajes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <ul  style={{listStyle: 'none'}}>
                    {comic.characters.items.map((character, i) => (
                        <li key={i}>
                          <Button sx={{justifyContent: 'flex-start'}} onClick={() => handleSelectCharacter(character.resourceURI)}> 
                            {character.name} 
                          </Button>
                        </li>                     
                    ))
                    }
                    </ul>
                  </AccordionDetails>
                </Accordion>
                :
                ""
                }
              </Box>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
              {comic.stock > 0 ? 
              <Button size='large' sx={{marginBottom: '2rem'}} onClick={()=> handleClickBuy(comic.id)}>Comprar</Button>
              :
              <Button disabled>Sin stock</Button>
              }
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{ height: '400px', width: 'auto' }}
            image={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
            alt={comic.title}
          />
        </Card>
      </BodySingle>
    </>
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  const comics = await getComics()

const paths = comics.data.results.flatMap((comic: Comic) =>
  ({ params: { id: String(comic.id) }})
);

return {
  paths,
  fallback: false
}
}

export const getStaticProps: GetStaticProps = async ({params}) =>{

  const id = Number(params?.id);

  try{
    const comic = await getComic(id);
    return{
      props: {
        comic,
      }
    }
  }

  catch(error){
    console.error('No se puede obtener el comic', error)
    return{
      props: {
        comic: {}
      }
    }
  }

}

export default ComicPage