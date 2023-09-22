import * as React from 'react';
import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "dh-marvel/components/layouts/body/single/body-single";
import { getComics } from 'dh-marvel/services/marvel/marvel.service';
import { Comics } from 'interfaces/comics';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface Props{
    comics: Comics;
    page: number
}

const Index: NextPage<Props> = ({comics}) => {

    const router = useRouter();
    const [page, setPage] = React.useState(1)

    const limit: number = 12;
    
    const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) =>{
        setPage(value)
        router.push(`/?page=${value}`);
    }

    const handleBuy = (comicId: number) => {
        router.push(`/checkout/${comicId}`)
    }

    const handleDetail = (comicId: number) => {
        router.push(`/comics/${comicId}`)
    }

    return (
        <>
        <Head>
            <title>Comics de Marvel</title>
            <meta name="description" content="Comics de Marvel disponibles"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <BodySingle>
            <Typography 
            gutterBottom 
            variant="h5" 
            component="div" 
            align="center"            
            sx={{mb:"30px", color: '#1976d2', fontWeight: '600'}}
            > 
            Tus comics favoritos en un solo lugar 
            </Typography>
            <Stack spacing={2} sx={{mx:"auto", marginBottom: '1rem'}}>
                <Pagination count={Math.ceil(comics.data.total/limit)} onChange={handleChangePage} />
            </Stack>
            <Box>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, xl: 12 }}>
                    {comics.data.results.map((comic)=>{
                        return (
                        <Grid xs={4} sm={4} md={4} xl={3} key={comic.id}>
                            <Card sx={{margin: '2rem'}}>
                                <CardMedia
                                    component="img"
                                    alt="Portada del comic"
                                    height="250"
                                    width='100'                        
                                    image={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                    />
                                <CardContent>
                                    <Typography gutterBottom sx={{fontSize: '15px'}} component="div">
                                    {comic.title}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="outlined" size="small" onClick={()=>{handleDetail(comic.id)}}>Ver detalle</Button>
                                    <Button variant="outlined" size="small" onClick={()=>{handleBuy(comic.id)}}>Comprar</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        )
                    })}
                </Grid>
            </Box>
        </BodySingle>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async ({req, res, query}) =>{
    const page: any = query.page || 1;
    const limit: number = 12;
    const offset = (page - 1) * limit;

    const comics = await getComics(offset, limit) 

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate'
    )

    return {
        props: {
            comics,
        },
    }
}

export default Index


