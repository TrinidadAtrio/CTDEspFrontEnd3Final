import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Faqs } from 'interfaces/faqs';
import { NextPage } from 'next'
import React from 'react'
import Head from 'next/head';


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
      
    </>
  )
}

export const getStaticProps = async () =>{
    const res = await fetch(`http://localhost:3000/api/faqs`) 
    const faqs = await res.json()
    console.log(faqs)

    return{
        props: {
            faqs
        }  
    }
    
}


export default FaqsPage