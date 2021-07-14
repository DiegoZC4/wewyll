import React from 'react'

const NonprofitList = ({nonprofits}) => {
    return (
        <div>
            {nonprofits.map((npo)=>
                    <Row key={npo.name}><Nonprofit data={npo}/></Row>)}
        </div>
    )
}

export default NonprofitList
