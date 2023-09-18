import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "dh-marvel/components/layouts/body/single/body-single";

const Index: NextPage = () => {
    return (
        <>
            <Head>
                <title>Comics de Marvel</title>
                <meta name="description" content="Comics de Marvel disponibles"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <BodySingle title={"Sample"}>

            </BodySingle>
        </>
    )
}

// export const getServerSideProps:GetServerSideProps = async ({req, res, query}) =>{

// }

export default Index


