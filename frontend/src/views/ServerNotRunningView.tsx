const ServerNotRunningView = () => {
    return (
        <div className='flex-center text-center white-element'>
            <a href="https://www.freepik.com">
                <img src='/images/no-connection.png' width="300px" height="300px" alt='' />
                <h2 className='text-main-color'>
                    SERVICE IS CURRENTLY NOT AVAILABLE
                    <br />
                    PLEASE CHECK AGAIN IN FEW MOMENTS
                </h2>
            </a>
        </div>
    )
}

export default ServerNotRunningView
