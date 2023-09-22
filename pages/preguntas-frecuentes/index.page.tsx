import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Faqs } from 'interfaces/faqs';
import { NextPage } from 'next'
import React from 'react'
import Head from 'next/head';
import BodySingle from 'dh-marvel/components/layouts/body/single/body-single';


interface Props {
    faqs: Faqs[];
}

const FaqsPage: NextPage<Props> = ({faqs}) => {
  return (
    <>
    <Head>
      <title>Preguntas frecuentes</title>
      <meta name="description" content="En esta página encontrará preguntas frecuentes"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>

    <BodySingle title='Preguntas frecuentes'>
      <Box sx={{margin: '2rem'}}>
        <Typography
          gutterBottom 
          variant="h6" 
          component="div" 
          align="center" 
          sx={{mb:"30px"}}
        >
        En esta página encontrarás preguntas frecuentes que pueden ser de ayuda
        </Typography>
        {faqs.map((faq) => (
          <div key={faq.id}>
            <Accordion sx={{margin: '2rem'}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" >{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </Box>
    </BodySingle>  
    </>
  )
}

export const getStaticProps = async () =>{
    const res = await fetch(`https://ctd-esp-front-end3-final.vercel.app/api/faqs`) 
    const faqs = await res.json()
    console.log(faqs)

    return{
        props: {
            faqs
        }  
    }
    
}


export default FaqsPage