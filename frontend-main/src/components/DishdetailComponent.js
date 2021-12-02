import React, { Component } from "react";
import {Card, CardImg, CardImgOverlay, CardText, CardTitle, CardBody, Breadcrumb, BreadcrumbItem,Button,
        Modal,ModalBody,ModalHeader, Row, Col} from "reactstrap";
import { Link } from "react-router-dom";
import { LocalForm,Control,Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from "react-animation-components";
import { checkPropTypes } from "prop-types";

const required = (val) => (val) && (val.length);
const maxLength = (len) => (val)=> !(val) || (val.length <= len);
const minLength = (len) => (val)=> (val) && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal(){
        this.setState({
            isModalOpen : !this.state.isModalOpen
        });
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId,values.rating,values.comment);
    }

    render(){
        return(
            <React.Fragment>
                <div>
                    <Button outline onClick={this.toggleModal} >
                        <span className="fa fa-pencil fa-lg">Submit Comment</span>
                    </Button>
                </div>
                
                <Modal isOpen = {this.state.isModalOpen} toggle = {this.toggleModal}>
                    <ModalHeader toggle = {this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit = {(values)=> this.handleSubmit(values)}>
                        <div className ="form-group">
                                <label htmlFor = "Rating" >Rating</label>
                                <Control.select model = ".rating" name = "rating" className = "form-control">
                                <option value="1" >1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                </Control.select>
                        </div>
                        <div className="form-group">
                                <label htmlFor = "comment">Comment</label>
                                <Control.textarea model = ".comment" name="comment" id="comment"
                                                  rows="6"
                                                className = "form-control"
                                />
                        </div>
                        <Row className="form-group">
                                <Col md={{size: 10}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>

                </Modal>

            </React.Fragment>
        )
    }

}

    function RenderDish({dish,dishId, favorite, postFavorite}){
        if(dish!=null){
            return(
                <FadeTransform in 
                        transformProps = {{
                            exitTransform : "scale(0.5) translateY(-50%)"
                }}>
                <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardImgOverlay>
                    <Button outline color="primary" onClick={() => favorite ? console.log('Already favorite') : postFavorite(dish._id)} >
                        {favorite ?
                            <span className="fa fa-heart"></span>
                            : 
                            <span className="fa fa-heart-o"></span>
                        }
                    </Button>
                </CardImgOverlay>
                <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>{dish.description}</CardText>
                </CardBody>
                </Card>
            </FadeTransform>
                
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

    function RenderComments({comments,postComment,dishId}){
        if(comments!=null){
            return(
                <div >
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                        {comments.map((comment)=> {
                            return(
                                <Fade in >
                                <li key={comment._id}>
                                    <div>
                                        <p>{comment.comment}</p>
                                        <p>{comment.rating} stars</p>
                                        <p>--{comment.author.firstname} {comment.author.lastname}, 
                                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.updatedAt)))}
                                        </p>
                                </div>
                                </li>
                                </Fade>
                            );
                        })}
                        </Stagger>
                    </ul>
                    <CommentForm dishId = {dishId} postComment = {postComment}/>
                </div>
            );
        }
        
        else{
            return(
                <div></div>
            );
        }
    }

    const DishDetail = (props) => {

        if(props.isLoading){
            return(
                <div className = "conatiner">
                    <div className = "row">
                        <Loading/>
                    </div>
                </div>
            )
        }

        else if(props.ErrMess){
            return(
                <div className = "conatiner">
                <div className = "row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
            )
        }

        else 
            return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>

                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} 
                                        postComment = {props.postComment}
                                        dishId = {props.dish._id} 
                        />
                    </div>
                </div>
                </div>
        );
    }

export default DishDetail;