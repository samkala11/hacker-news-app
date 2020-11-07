import Skeleton from '@material-ui/lab/Skeleton';
import '../../styles/Loading/Loader.css';

const Loader = () => {
    return(<div className="loading">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
    </div> )
}

export default Loader;