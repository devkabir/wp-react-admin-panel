<?php
/**
 * Plugin Name: WP React Admin Panel
 * Description: A custom WordPress plugin with an admin UI using block packages.
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue scripts for the admin page
function my_admin_plugin_enqueue_scripts($hook) {
    if ($hook !== 'toplevel_page_wp-react-admin-panel') {
        return;
    }

    $asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');

    wp_enqueue_script(
        'wp-react-admin-panel',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version'],
        true
    );

    wp_enqueue_style(
        'wp-react-admin-panel',
        plugins_url('build/index.css', __FILE__),
        array('wp-components'),
        '1.0'
    );
}
add_action('admin_enqueue_scripts', 'my_admin_plugin_enqueue_scripts');

// Add admin menu
function my_admin_plugin_menu() {
    add_menu_page(
        __('WP React Admin Panel', 'textdomain'),
        __('Admin UI', 'textdomain'),
        'manage_options',
        'wp-react-admin-panel',
        'render_wp_react_admin_panel',
        'dashicons-admin-generic',
        20
    );
}
add_action('admin_menu', 'my_admin_plugin_menu');

function render_wp_react_admin_panel() {
    echo '<div id="wp-react-admin-panel-root"></div>';
}
// Register REST API endpoints
function wp_react_admin_panel_register_rest() {
    // Endpoint to save option
    register_rest_route('my-admin-plugin/v1', '/save-option', array(
        'methods'  => 'POST',
        'callback' => 'wp_react_admin_panel_save_option',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    // Endpoint to get saved option
    register_rest_route('my-admin-plugin/v1', '/get-option', array(
        'methods'  => 'GET',
        'callback' => 'wp_react_admin_panel_get_option',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
}
add_action('rest_api_init', 'wp_react_admin_panel_register_rest');

// Save option callback
function wp_react_admin_panel_save_option(WP_REST_Request $request) {
    $params = $request->get_json_params();
    
    if (!isset($params['option_value'])) {
        return new WP_Error('missing_parameter', 'Missing required parameter', array('status' => 400));
    }

    update_option('wp_react_admin_panel_option', sanitize_text_field($params['option_value']));

    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Option saved successfully!'
    ));
}

// Get option callback
function wp_react_admin_panel_get_option() {
    $saved_option = get_option('wp_react_admin_panel_option', '');

    return rest_ensure_response(array(
        'success' => true,
        'option_value' => $saved_option
    ));
}
