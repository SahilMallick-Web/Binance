import React from 'react'
import Bannercard from '../CommonParts/Bannercard'
import { useQuery } from 'react-query'
import { fetchSingleratesDetails, fetchallrates } from '@/API/Apifunctions/Ratesapimanage'
import { Box, Button, Modal, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import StoreIcon from '@mui/icons-material/Store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';

const index = () => {
    // Modal Code Start From Here
    const [selectRatesid, setselectRatesid] = React.useState(null);
    const [modalopen, setmodalopen] = React.useState(false);
    const { data: allrates, isLoading: ratesloading, isError: rateserror } = useQuery({
        queryFn: () => fetchallrates(),
        queryKey: "allrates"
    })

    // Single rates fetch by ID
    const { data: singlerates, isLoading: singlerateloading, isError: singlerateerror } = useQuery({
        queryFn: () => fetchSingleratesDetails(selectRatesid),
        queryKey: ["singlerates", { selectRatesid }],
        enabled: !!selectRatesid,
    });


    const handlemodalopen = () => {
        setmodalopen(true);
    };
    const handleClose = () => {
        setmodalopen(false);
    };

    const handlclicks = async (id: any) => {
        try {
            setselectRatesid(id);
            const result = await fetchSingleratesDetails(id);
            if (result) {
                handlemodalopen();
            } else {
                console.log("error Found");
            }
        } catch (error) {
            console.log(error);

        }
    };

    console.log(singlerates);

    return (
        <>
            <Bannercard />
            <Typography variant="h4" className='singletext'>
                All Assets Details
            </Typography>
            <Box className="assetstable">
                {
                    ratesloading ? (
                        <>
                            <Skeleton variant="rounded" width={"100%"} height={40} animation="wave" />
                            <Skeleton variant="text" width={"100%"} height={60} animation="wave" />
                            <Skeleton variant="rounded" width={"100%"} height={40} animation="wave" />
                            <Skeleton variant="rounded" width={"100%"} height={40} animation="wave" />
                            <Skeleton variant="text" width={"100%"} height={60} animation="wave" />
                            <Skeleton variant="rounded" width={"100%"} height={40} animation="wave" />
                        </>
                    ) : (
                        <>
                            <TableContainer className="custom-table-container">
                                <Table className="custom-table">
                                    <TableHead className='tableheader'>
                                        <TableRow>
                                            <TableCell className="custom-cell header">ID</TableCell>
                                            <TableCell align="center" className="custom-cell header">Symbol</TableCell>
                                            <TableCell align="center" className="custom-cell header">Currency Symbol</TableCell>
                                            <TableCell align="center" className="custom-cell header">Type</TableCell>
                                            <TableCell align="center" className="custom-cell header">Rate USD</TableCell>
                                            <TableCell align="center" className="custom-cell header">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allrates?.slice(0, 10)?.map((item, index) => (
                                            <TableRow key={index} className="custom-row">
                                                <TableCell align="center" className="custom-cell" onClick={() => handlclicks(item?.id)}>{item.id}</TableCell>
                                                <TableCell align="center" className="custom-cell" onClick={() => handlclicks(item?.id)}>{item?.symbol}</TableCell>
                                                <TableCell align="center" className="custom-cell" onClick={() => handlclicks(item?.id)}>{item?.currencySymbol || "Not Avialable"}</TableCell>
                                                <TableCell align="center" className="custom-cell" onClick={() => handlclicks(item.id)}>{item?.type}</TableCell>
                                                <TableCell align="center" className="custom-cell" onClick={() => handlclicks(item.id)}>{item?.rateUsd}</TableCell>
                                                <TableCell align="center" className="custom-cell">
                                                    <Box className="actionbtn">
                                                        <Button variant='contained' color='success' startIcon={<RemoveRedEyeIcon />} onClick={() => handlclicks(item?.id)} className='btndesign'>View</Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )
                }
            </Box>




            {/* Single Assets Details Modal */}
            <Modal
                open={modalopen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box className="custom-modal">
                    {singlerateloading ? (
                        <p>Loading...</p>
                    ) : singlerateerror ? (
                        <p>Error loading asset details</p>
                    ) : (
                        singlerates && (
                            <>
                                <Box className="singledetails-container">
                                    <div className="singledetails-left">
                                        <Typography variant="h4" className='singletext'>
                                            <b>Name:</b> {singlerates?.id}
                                        </Typography>
                                        <hr />
                                        <Typography variant="h6" className='singletext'>
                                            <b>Symbol:</b> {singlerates?.symbol}
                                        </Typography>
                                        <Typography variant="h6" className='singletext'>
                                            <b>Currency Symbol:</b> {singlerates?.currencySymbol || "Not Avialable"}
                                        </Typography>
                                        <Typography variant="h6" className='singletext'>
                                            <b>Max Supply:</b> {singlerates?.type}
                                        </Typography>
                                    </div>
                                </Box>
                                <center>
                                    <Button onClick={handleClose} variant='outlined' color='secondary'>Close</Button>
                                </center>
                            </>
                        )
                    )}
                </Box>
            </Modal>
        </>
    )
}

export default index