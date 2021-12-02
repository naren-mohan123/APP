import React, {Component} from "react";
import Header from "./HeaderComponent";
import Home from "./HomeComponent";
import About from "./AboutComponent";
import Menu from "./MenuComponent";
import Contact from "./ContactComponent";
import DishDetail from "./DishdetailComponent";
import Favorites from "./FavoriteComponent";
import Footer from "./FooterComponent";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { postComment, fetchDishes, fetchComments, fetchPromos,fetchLeaders,postFeedback, loginUser,logoutUser,fetchFavorites,postFavorite,deleteFavorite } from "../Redux/ActionCreators";
import { actions } from "react-redux-form";
import { CSSTransition,TransitionGroup } from "react-transition-group";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
    favorites : state.favorites,
    auth : state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  postComment : (dishId,rating,comment) => dispatch(postComment(dishId,rating,comment)),
  postFeedback : (feedback) => dispatch(postFeedback(feedback)),
  fetchDishes : () => {dispatch(fetchDishes())},
  resetFeedbackForm : () => {dispatch(actions.reset("feedback"))},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders : () => dispatch(fetchLeaders()),
  loginUser : (creds) => dispatch(loginUser(creds)),
  logoutUser : () => dispatch(logoutUser()),
  fetchFavorites : () => dispatch(fetchFavorites()),
  postFavorite : (dishId) => dispatch(postFavorite(dishId)),
  deleteFavorite : (dishId) => dispatch(deleteFavorite(dishId))

});

class Main extends Component {
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.fetchFavorites();
    
  }

  render() {
    
    const HomePage = () => {
      return(
        <Home dish ={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
              DishesLoading = {this.props.dishes.isLoading}
              DishesErrMess = {this.props.dishes.errMess}
              promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
              promoLoading={this.props.promotions.isLoading}
              promoErrMess={this.props.promotions.errMess}
              leader ={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
              leadersLoading={this.props.leaders.isLoading}
              leadersErrMess={this.props.leaders.errMess}
        />
      );
    }

    const DishWithId = ({match}) => {
      return(
        this.props.auth.isAuthenticated ?
          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === (match.params.dishId))[0]} 
            isLoading = {this.props.dishes.isLoading}
            ErrMess = {this.props.dishes.errMess}
            comments={this.props.comments.comments.filter((comment) => comment.dish === (match.params.dishId))}
            commentsErrMess={this.props.comments.errMess}
            postComment = {this.props.postComment}
            favorite={this.props.favorites.favorites.dishes.some((dish) => dish._id === match.params.dishId)}
            postFavorite={this.props.postFavorite}
            /> 
          
          :

          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === (match.params.dishId))[0]} 
            isLoading = {this.props.dishes.isLoading}
            ErrMess = {this.props.dishes.errMess}
            comments={this.props.comments.comments.filter((comment) => comment.dish === (match.params.dishId,10))}
            commentsErrMess={this.props.comments.errMess}
            postComment = {this.props.postComment}
            favorite={false}
            postFavorite={this.props.postFavorite}  
          />
            );
    };

    const PrivateRouter = ({component : Component,...rest}) => (
      <Route {...rest} render = {(props) => (
        this.props.auth.isAuthenticated 
          ? 
        <Component {...props}/>
        :
        <Redirect to = {{
          pathname : "/home",
          state : {from : props.location}
        }}/>
      )}
      
      />
    )

    return (
      <div className="App">
        <Header auth = {this.props.auth}
                loginUser = {this.props.loginUser}
                logoutUser = {this.props.logoutUser}
        />
        <TransitionGroup>
          <CSSTransition key = {this.props.location.key} classNames="page" timeout={300}>
          <Switch location = {this.props.location}>
              <Route path='/home' component={HomePage} />
              <Route exact path="/aboutus" component={()=> <About leaders ={this.props.leaders}/>}/>
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              <PrivateRouter exact path = "/favorites" component = {() => <Favorites favorites = {this.props.favorites} deleteFavorite = {this.props.deleteFavorite} />} />
              <Route exact path="/contactus" component={ () => <Contact postFeedback = {this.props.postFeedback} resetFeedbackForm = {this.props.resetFeedbackForm}  />}/>
              <Redirect to="/home" />
          </Switch>
          </CSSTransition>
        </TransitionGroup>

        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));